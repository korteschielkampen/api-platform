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
  };

  const options = {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  };

  readableLog("REQUESTING WITH THIS DATA TO LIGHTSPEED", options);

  (() => {
      fetch('https://cloud.lightspeedapp.com/oauth/access_token.php', options)
        .then(response => response.json())
        .then(json => {
          readableLog("RESPONSE FROM LIGHTSPEED -- SUCCESSFULL", json)
          respond({ status: 200, body: json});
        })
        .catch(err => {
          readableLog("RESPONSE FROM LIGHTSPEED -- FAILED", err)
          respond({ status: 422, body: "Mislukt - (Status code: 422)" });
        });
    }
  )();

}
