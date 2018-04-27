const fetch = require('node-fetch');
const AWS = require("aws-sdk");

export default updateDynamo = async (event, callback) => {
  const payload = JSON.parse(event.body);

  AWS.config.update({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key
  })
  AWS.config.update({region: 'eu-central-1'});

  const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

  var params = {
    TableName: 'lightspeed-to-moneybird',
    Item: {
      'account_id' : {N: payload.accountID},
      'account_name' : {S: payload.accountName},
      'account_link' : {S: payload.accountLink},
      'access_token' : {S: payload.access_token},
      'refresh_token' : {S: payload.refresh_token}
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
