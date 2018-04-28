import fetch from 'node-fetch'
import _ from 'lodash'

import readDynamo from './auth/dynamo/read.js'
import updateDynamo from './auth/dynamo/update.js'
import refreshTokens from './auth/moneybird/refresh-tokens.js'
import createInvoice from './api/moneybird/create-invoice.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  try {
    // Restructuring a invoice to Moneybird
    let invoice = JSON.parse(event.body);





    // Authentication and updating - WORKING
    let auth = await readDynamo(211688738215954180);
    let tokens = await refreshTokens(auth.refresh_token);
    auth = {
      ...auth,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    };
    updateDynamo(auth);

    // Sending an invoice to Moneybird
    let validInvoice = {
      "sales_invoice": {
        "reference": "My first API invoice",
        "contact_id": 31742,
        "details_attributes": {
          "0":{
            "description":"Table",
            "price":"10.5"
          }
        }
      }
    };

    console.log(validInvoice);
    let created = await createInvoice(auth.access_token, validInvoice);

    respond({
      status: 200,
      body: {
        message: "Invoice is succesfully created",
        // created: created
      }
    });

  } catch(err) {
    respond({ status: 422, body: err });
  }
}
