import fetch from 'node-fetch'
import _ from 'lodash'

import readTax from './api/lightspeed/read-reports-taxbyday.js'
import readPayments from './api/lightspeed/read-reports-paymentsbyday.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  try {
    // set dates to last 30 days
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 21);
    startDate = startDate.toISOString();
    const endDate = (new Date).toISOString();
    const dates = {start: startDate, end: endDate};

    // Get tax and payment data
    let tax = await readTax(dates);
    let payments = await readPayments(dates);

    // Group by day, nest and merge
    let groupedTax =  _.groupBy(tax.SalesDay, "date");
    let groupedPayments =  _.groupBy(payments.Payments, "date");
    let nestedTax = Object.keys(groupedTax).map(k => ({[k]: {tax: groupedTax[k]}}));
    let nestedPayments = Object.keys(groupedPayments).map(k => ({
      [k]: {
        payments: groupedPayments[k]
      }
    }));
    let invoices = _.merge({}, ...nestedTax, ...nestedPayments);

    respond({
      status: 200,
      body: {
        authData: {
          truncated: "A lot here, but not for the client to view"
        },
        invoices: invoices
      }
    });

  } catch(err) {
    respond({ status: 422, body: err });
  }
}
