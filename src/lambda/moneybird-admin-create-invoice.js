import _ from 'lodash'
import moment from 'moment'
import util from 'util'

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
    const dayreport = JSON.parse(event.body);
    let date = moment(dayreport.date).format("YYYY-MM-DD");

    let financialStatement = {};
    let invoice = {
      "sales_invoice": {
        "reference": `Automated Lightspeed Invoice - ${moment(dayreport.date).format()}`,
        "contact_id": "211718269128672982",
        "invoice_date": moment(dayreport.date).format("YYYY-MM-DD"),
        "state": "open",
        "prices_are_incl_tax": true,
        "details_attributes": []
      }
    };

    // Hoog BTW
    if (parseFloat(dayreport.tax.hoog.amount) !== 0) {
      invoice.sales_invoice.details_attributes.push({
        "description": "Hoog BTW tarief",
        "tax_rate_id": "211688738873410854",
        ledger_account_id: "218027560947156696",
        "price": dayreport.tax.hoog.amount
      })
    }
    // Laag BTW
    if (parseFloat(dayreport.tax.laag.amount) !== 0) {
      invoice.sales_invoice.details_attributes.push({
        "description": "Laag BTW tarief",
        "tax_rate_id": "211688738875508007",
        ledger_account_id: "218027538317837859",
        "price": dayreport.tax.laag.amount
      })
    }
    // Nul BTW
    if (parseFloat(dayreport.tax.onbelast.amount) !== 0) {
      invoice.sales_invoice.details_attributes.push({
        "description": "Onbelast BTW tarief",
        "tax_rate_id": "212145631538448378",
        ledger_account_id: "218027616763905200",
        "price": dayreport.tax.onbelast.amount
      })
    }

    // Cadeaukaart
    if (parseFloat(dayreport.payments.gift.amount) !== 0) {
      console.log("giftcard run")
      invoice.sales_invoice.details_attributes.push({
        "description": "Betalingen met of uitgifte van cadeaukaarten",
        "tax_rate_id": "212145631538448378",
        "ledger_account_id": "212771713877804212",
        "price": -dayreport.payments.gift.amount
      })
    }
    // Kredietaccount
    if (parseFloat(dayreport.payments.credit.amount) !== 0) {
      invoice.sales_invoice.details_attributes.push({
        "description": "Betalingen met of uitgifte van klantkredieten",
        "price": -dayreport.payments.credit.amount
      })
    }
    // Cash
    if (parseFloat(dayreport.payments.cash.amount) !== 0) {
      financialStatement = {
        "financial_statement": {
          "reference": `Kasboek - Lightspeed Dagontvangst - ${moment(dayreport.date).format("YYYY-MM-DD")}`,
          "financial_account_id": "211688922621675193",
          "financial_mutations_attributes": {
            "1": {
              "date": moment(dayreport.date).format("YYYY-MM-DD"),
              "message": "Winkelontvangsten",
              "amount": dayreport.payments.cash.amount
            }
          }
        }
      };
    }

    // Creating and sending invoice in Moneybird
    console.log("creating invoice")
    let createdInvoice = await createInvoice(invoice);
    console.log("sending invoice")
    let sendedInvoice = await sendInvoice(createdInvoice.id);
    console.log("creating mutation")
    let createdMutation = await createMutation(financialStatement);

    // Linking the booking
    let booking = {
      "booking_type": "SalesInvoice",
      "booking_id": createdInvoice.id,
      "price_base": createdMutation.financial_mutations[0].amount
    };
    console.log("creating booking")
    let createdBooking = await updateMutation(createdMutation.financial_mutations[0].id, booking);

    respond({
      status: 200,
      body: {
        message: "Invoice is succesfully created",
      }
    });
  } catch(err) {
    console.log(err);
    respond({ status: 422, body: err });
  }
}
