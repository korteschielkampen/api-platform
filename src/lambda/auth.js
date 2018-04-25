const fetch = require('node-fetch');

exports.handler = function handler(event, context, callback) {
  console.log();

  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };


  const payload  = {
    client_id: "4c23f9e681c44d339359a38dc340522fae805ddab5e372c39762ef91c080179d",
    client_secret: "",
    code: event.queryStringParameters.code,
    grant_type: "authorization_code",
  }
  console.log(payload)

  (() => {
      fetch('https://cloud.lightspeedapp.com/oauth/access_token.php', payload)
        .then(response => response.json())
        .then(json => {
          respond({ status: 200, body: "Aangevraagd" });
        })
        .catch(err => {
          respond({ status: 422, body: "Couldn't  get the data" });
        });
    }
  )();

  // (() => {
  //     fetch('https://jsonplaceholder.typicode.com/posts/1')
  //       .then(response => response.json())
  //       .then(json => {
  //         respond({ status: 200, body: "Aangevraagd" });
  //       })
  //       .catch(err => {
  //         respond({ status: 422, body: "Couldn't  get the data" });
  //       });
  //   }
  // )();
}

// https://www.rjkorteschiel.nl
// https://www.rjkorteschiel.nl/lightspeed-redirect/
