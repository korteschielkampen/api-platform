const fetch = require('node-fetch');
const AWS = require("aws-sdk");

const readableLog = (message, data) => {
  console.log("")
  console.log("")
  console.log("")
  console.log("")
  console.log("")
  console.log(` ------ ${message} ------- `)
  console.log("")
  console.log("")
  data && console.log(data)
  console.log("")
  console.log("")
  console.log("")
}


exports.handler = function handler(event, context, callback) {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  const receivedPayload = JSON.parse(event.body);

  // Do AWS DynamoDB storage
  AWS.config.update({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key
  })
  AWS.config.update({region: 'eu-central-1'});

  const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

  var params = {
    TableName: 'lightspeed-to-moneybird',
    Item: {
      'account_id' : {N: "12072434"},
      'account_name' : {S: "Korteschiel Kampen Test"},
      'access_token' : {S: receivedPayload.access_token},
      'refresh_token' : {S: receivedPayload.refresh_token}
    }
  };

  ddb.putItem(params, function(err, data) {
    if (err) {
      readableLog("STORE TO AWS --- FAILED", err);
      respond({ status: 400, body: {error: err }});
    } else {
      readableLog("STORE TO AWS --- SUCCESFULL")
      respond({ status: 200, body: "Aangevraagd en opgeslagen - (Status code: 200)" });
    }
  });
}
