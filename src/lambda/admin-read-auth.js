const fetch = require('node-fetch');
const AWS = require("aws-sdk");
const readDynamo = require("./rest-actions/read-dynamo.js");

exports.handler = function handler(event, context, callback) {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  readDynamo(159502 , respond);  // Read Lightspeed from Dynamo
  // readDynamo(159502 , respond);  // Read Moneybird from Dynamo

}
