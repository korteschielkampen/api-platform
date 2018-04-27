const fetch = require('node-fetch');
const AWS = require("aws-sdk");

exports.handler = function handler(event, context, callback) {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  const receivedPayload = JSON.parse(event.body);

  AWS.config.update({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key
  })
  AWS.config.update({region: 'eu-central-1'});

  const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

  var params = {
    TableName: 'lightspeed-to-moneybird',
    Item: {
      'account_id' : {N: receivedPayload.accountID},
      'account_name' : {S: receivedPayload.accountName},
      'account_link' : {S: receivedPayload.accountLink},
      'access_token' : {S: receivedPayload.access_token},
      'refresh_token' : {S: receivedPayload.refresh_token}
    }
  };

  ddb.putItem(params, function(err, data) {
    if (err) {
      respond({ status: 400, body: {error: err }});
    } else {
      respond({ status: 200, body: "Aangevraagd en opgeslagen - (Status code: 200)" });
    }
  });
}
