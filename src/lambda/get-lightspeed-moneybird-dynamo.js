const fetch = require('node-fetch');
const AWS = require("aws-sdk");

exports.handler = function handler(event, context, callback) {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  AWS.config.update({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key
  })
  AWS.config.update({region: 'eu-central-1'});

  const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

  const dcddb = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: 'lightspeed-to-moneybird',
    Key: {
      "account_id": 159502,
    }
  };

  console.log("-----------")
  console.log("PARAMS", params)
  console.log("-----------")

  dcddb.get(params, function(err, data) {
    if (err) {
      console.log("-----------")
      console.log("FAILED BIGTIME", err)
      console.log("-----------")
      respond({ status: 400, body: {error: err }});
    } else {
      console.log("-----------")
      console.log("YAY! SUCCESSS", data)
      console.log("-----------")
      respond({ status: 200, body: data });
    }
  });
}
