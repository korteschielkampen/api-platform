import _ from 'lodash'
import moment from 'moment'
import util from 'util'

import parseInvoice from './transformation/dayreport--to--moneybird-invoice.js'
import parseStatement from './transformation/dayreport--to--moneybird-statement.js'
import parseBooking from './transformation/moneybird-invoice-and-mutation--to--moneybird-invoice.js'
import createInvoice from './api/moneybird/create-sales-invoice.js'
import sendInvoice from './api/moneybird/update-sales-invoice.js'
import createMutation from './api/moneybird/create-financial-statement.js'
import updateMutation from './api/moneybird/update-financial-mutation.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  try {
    // Parse payload
    const dayreport = JSON.parse(event.body);

    // Creating and sending invoice in Moneybird
    console.log("creating invoice")
    const invoice = parseInvoice(dayreport);
    let createdInvoice = await createInvoice(invoice);
    console.log("sending invoice")
    let sendedInvoice = await sendInvoice(createdInvoice.id);

    // Doing financial mutations if there are cash transactions
    if (parseFloat(dayreport.payments.cash.amount) !== 0) {

      // Creating Mutation
      console.log("creating mutation")
      let financialStatement = parseStatement(dayreport);
      let createdMutation = await createMutation(financialStatement);

      // Linking the booking
      console.log("creating booking")
      let booking = await parseBooking(createdInvoice, createdMutation);
      let createdBooking = await updateMutation(createdMutation.financial_mutations[0].id, booking);

    } else {

      console.log("No cash transactions, skipping")

    }

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
