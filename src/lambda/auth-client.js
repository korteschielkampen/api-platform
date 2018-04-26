const fetch = require('node-fetch');
// Load the AWS SDK for Node.js
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








const storeToAWS = (data, respond) => {
  // Do AWS DynamoDB storage
  AWS.config.update({region: 'eu-central-1'});
  const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

  var params = {
    TableName: 'lightspeed-to-moneybird',
    Item: {
      'account_id' : {N: "12072434"},
      'account_name' : {S: "Korteschiel Kampen"},
      'access_token' : {S: "token"},
      'refresh_token' : {S: "refresh"}
    }
  };

  ddb.putItem(params, function(err, data) {
    if (err) {
      readableLog("STORE TO AWS --- FAILED", err)
    } else {
      readableLog("STORE TO AWS --- SUCCESFULL")
      respond({ status: 200, body: "Aangevraagd en opgeslagen - (Status code: 200)" });
    }
  });
}






exports.handler = function handler(event, context, callback) {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  const payload = {
    client_id: "4c23f9e681c44d339359a38dc340522fae805ddab5e372c39762ef91c080179d",
    client_secret: process.env.LIGHTSPEED,
    code: event.queryStringParameters.code,
    grant_type: "authorization_code",
  }

  const options = {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  }

  console.log(options);

  (() => {
      fetch('https://cloud.lightspeedapp.com/oauth/access_token.php', options)
        .then(response => response.json())
        .then(json => {
          readableLog("RESPONSE FROM LIGHTSPEED -- SUCCESSFULL", json)
          // storeToAWS(json, respond);
        })
        .catch(err => {
          readableLog("RESPONSE FROM LIGHTSPEED -- FAILED", err)
          respond({ status: 422, body: "Mislukt - (Status code: 422)" });
        });
    }
  )();

}
