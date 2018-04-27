const fetch = require('node-fetch');
const AWS = require("aws-sdk");

export default async (payload, callback) => {

  AWS.config.update({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key
  })
  AWS.config.update({region: 'eu-central-1'});

  const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});
  const dcddb = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: 'lightspeed-to-moneybird',
    Item: {
      'account_id' : {N: payload.account_id},
      'account_name' : {S: payload.account_name},
      'account_link' : {S: payload.account_link},
      'access_token' : {S: payload.access_token},
      'refresh_token' : {S: payload.refresh_token}
    }
  };

  ddb.putItem(params, function(err, data) {
    if (err) {
      return err;
    } else {
      return true;
    }
  });
  
}
