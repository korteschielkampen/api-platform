import fetch from 'node-fetch'
import createTokens from './auth/lightspeed/create-tokens.js'
import readAccount from './api/lightspeed/read-account.js'
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
    let authData = {
      'account_id' : account.Account.accountID,
      'account_name' : account.Account.name,
      'account_link' : account.Account.link['@attributes'].href,
      'access_token' : tokens.access_token,
      'refresh_token' : tokens.refresh_token
    }
    let dynamo = await updateDynamo(authData);

    respond({ status: 200, body: {authData: authData, stored: dynamo}});

  } catch(err) {
    respond({ status: 422, body: err });
  }
}
