const fetch = require('node-fetch');

export default readDynamo = async (account_id, callback) => {
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
      "account_id": account_id,
      // "account_id": account_id,
    }
  };

  dcddb.get(params, function(err, data) {
    if (err) {
      callback({ status: 400, body: {error: err }});
    } else {
      callback({ status: 200, body: data });
    }
  });
}
