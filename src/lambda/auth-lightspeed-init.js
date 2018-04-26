const fetch = require('node-fetch');

const readableLog = (message, data) => {
  console.log(` ------ ${message} ------- `)
  console.log("")
  data && console.log(data)
  console.log("")
  console.log(" ------------------------- ")
}

const getTokens = async (code, respond) => {
  const payload = {
    client_id: "4c23f9e681c44d339359a38dc340522fae805ddab5e372c39762ef91c080179d",
    client_secret: process.env.LIGHTSPEED,
    code: code,
    grant_type: "authorization_code",
  };
  const options = {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  };

  try {
    const response = await fetch('https://cloud.lightspeedapp.com/oauth/access_token.php', options);
    const json = await response.json();
    return json;
  } catch(err) {
    respond({ status: 422, body: {error: "Connecting to the Lightspeed OAUTH API failed"}});
  }
}

const getAccountDetails = async (tokens, respond) => {




}

const getData = async (code, respond) => {
  try {
    var tokens = await getTokens(code, respond);
    var account = await getAccountDetails(tokens, respond);
    respond({ status: 200, body: tokens});
  } catch(err) {
    respond({ status: 422, body: {error: "Either OAUTH or ACCOUNT connections failed"}});
  }
}

exports.handler = function handler(event, context, callback) {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  getData(event.queryStringParameters.code, respond);

}
