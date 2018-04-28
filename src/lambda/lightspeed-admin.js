import fetch from 'node-fetch'
import _ from 'lodash'

import readDynamo from './auth/dynamo/read.js'
import updateDynamo from './auth/dynamo/update.js'
import refreshTokens from './auth/lightspeed/refresh-tokens.js'
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
    // Authentication and updating
    let authData = await readDynamo(159502);
    let tokens = await refreshTokens(authData.refresh_token);
    if (authData.access_token !== tokens.access_token) {
      updateDynamo({...authData, access_token: tokens.access_token});
    }

    // set dates to last 30 days
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 5);
    startDate = startDate.toISOString();
    const endDate = (new Date).toISOString();
    const dates = {start: startDate, end: endDate};

    // Get tax and payment data
    let tax = await readTax(tokens.access_token, dates);
    let payments = await readPayments(tokens.access_token, dates);

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

    console.log(invoices)

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
