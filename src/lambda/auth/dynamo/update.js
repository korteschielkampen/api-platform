const fetch = require('node-fetch');
const AWS = require("aws-sdk");

export default async (authData) => {
  // AWS configuration
  AWS.config.update({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key
  })
  AWS.config.update({region: 'eu-central-1'});
  const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});
  const dcddb = new AWS.DynamoDB.DocumentClient();

  // Configure request
  var params = {
    TableName: 'lightspeed-to-moneybird',
    Item: {
      'account_id' : authData.account_id,
      'account_name' : authData.account_name,
      'account_link' : authData.account_link,
      'access_token' : authData.access_token,
      'refresh_token' : authData.refresh_token
    }
  };

  // Send request
  try {
    return await dcddb.put(params).promise();
  } catch(err) {
    throw err;
  }
}
