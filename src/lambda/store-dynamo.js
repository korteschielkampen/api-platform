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
