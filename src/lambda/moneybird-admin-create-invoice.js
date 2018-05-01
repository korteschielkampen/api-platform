import _ from 'lodash'
import moment from 'moment'

import createInvoice from './api/moneybird/create-sales-invoice.js'
import sendInvoice from './api/moneybird/update-sales-invoice.js'
import createMutation from './api/moneybird/create-financial-statement.js'
import updateMutation from './api/moneybird/update-financial-statement.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  try {
    // Restructuring a invoice to Moneybird
    const invoice = JSON.parse(event.body);
    let financialStatement = {};
    let moneybirdInvoice = {
      "sales_invoice": {
        "reference": `Automated Lightspeed Invoice - ${invoice.payments[0].date}`,
        "contact_id": "211718269128672982",
        "invoice_date": moment(invoice.payments[0].date, "MM/DD/YYYY").format("YYYY-MM-DD"),
        "state": "open",
        "prices_are_incl_tax": false,
        "details_attributes": []
      }
    };

    invoice.tax.map((tax, key)=>{
      // Hoog BTW
      if (tax.taxClassID == 1) {
        moneybirdInvoice.sales_invoice.details_attributes.push({
          "description": "Hoog BTW tarief",
          "tax_rate_id": "211688738873410854",
          ledger_account_id: "218027560947156696",
          "price": tax.subtotal
        })
      }
      // Laag BTW
      if (tax.taxClassID == 3) {
        moneybirdInvoice.sales_invoice.details_attributes.push({
          "description": "Laag BTW tarief",
          "tax_rate_id": "211688738875508007",
          ledger_account_id: "218027538317837859",
          "price": tax.subtotal
        })
      }
      // Nul BTW
      if (tax.taxClassID == 6) {
        moneybirdInvoice.sales_invoice.details_attributes.push({
          "description": "Onbelast BTW tarief",
          "tax_rate_id": "212145631538448378",
          ledger_account_id: "218027616763905200",
          "price": tax.subtotal
        })
      }
    })

    invoice.payments.map((payment, key)=>{
      // Cadeaukaart
      if (payment.paymentTypeID == 5) {
        moneybirdInvoice.sales_invoice.details_attributes.push({
          "description": "Betalingen met of uitgifte van cadeaukaarten",
          "tax_rate_id": "212145631538448378",
          "ledger_account_id": "212771713877804212",
          "price": -payment.amount
        })
      }
      // Kredietaccount
      if (payment.paymentTypeID == 4 ) {
        moneybirdInvoice.sales_invoice.details_attributes.push({
          "description": "Betalingen met of uitgifte van klantkredieten",
          "price": payment.amount
        })
      }
      // Cash
      if (payment.paymentTypeID == 1 ) {
        financialStatement = {
          "financial_statement": {
            "reference": `Kasboek - Lightspeed Dagontvangst - ${moment(payment.date, "MM/DD/YYYY").format("YYYY-MM-DD")}`,
            "financial_account_id": "211688922621675193",
            "financial_mutations_attributes": {
              "1": {
                "date": moment(invoice.payments[0].date, "MM/DD/YYYY").format("YYYY-MM-DD"),
                "message": "Winkelontvangsten",
                "amount": payment.amount
              }
            }
          }
        };
      }
    })

    // Creating and sending invoice in Moneybird
    let createdInvoice = await createInvoice(moneybirdInvoice);
    let sendedInvoice = await sendInvoice(createdInvoice.id);
    let createdMutation = await createMutation(financialStatement);

    // Linking the booking
    let booking = {
      "booking_type": "SalesInvoice",
      "booking_id": createdInvoice.id,
      "price_base": createdMutation.financial_mutations[0].amount
    };
    let createdBooking = await updateMutation(createdMutation.financial_mutations[0].id, booking);

    respond({
      status: 200,
      body: {
        message: "Invoice is succesfully created",
        createdInvoice: createdInvoice,
        createdMutation: createMutation,
        createdBooking: createdBooking
      }
    });
  } catch(err) {
    console.log(err);
    respond({ status: 422, body: err });
  }
}
