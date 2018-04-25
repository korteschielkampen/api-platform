const fetch = require('node-fetch');

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

  (() => {
      fetch('https://cloud.lightspeedapp.com/oauth/access_token.php', options)
        .then(response => response.json())
        .then(json => {
          console.log(json);
          respond({ status: 200, body: "Aangevraagd" });
        })
        .catch(err => {
          console.log(err);
          respond({ status: 422, body: "Mislukt" });
        });
    }
  )();
}
