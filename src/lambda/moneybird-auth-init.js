import fetch from 'node-fetch'
import createTokens from './auth/moneybird/create-tokens.js'
import readAccount from './api/moneybird/read-administration.js'
import updateDynamo from './auth/dynamo/update.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  try {
    let tokens = await createTokens(event.queryStringParameters.code);
    let account = await readAccount(tokens.access_token);
    console.log("-------------ACOUNTDATA UNFILTERED---------------")
    console.log(account)
    console.log("-------------ACOUNTDATA UNFILTERED---------------")
    let authData = {
      'account_id' : parseFloat(account[0].id, 10),
      'account_name' : account[0].name,
      'access_token' : tokens.access_token,
      'refresh_token' : tokens.refresh_token
    }
    let dynamo = await updateDynamo(authData);

    respond({ status: 200, body: {authData: authData, stored: dynamo}});
  } catch(err) {
    respond({ status: 422, body: err });
  }
}
