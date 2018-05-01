import fetch from 'node-fetch'
import createToken from './auth/moneybird/create-token.js'
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
    let tokens = await createToken(event.queryStringParameters.code);
    console.log(tokens)
    let account = await readAccount(tokens.access_token);
    let auth = {
      'account_id' : account[0].id,
      'account_name' : account[0].name,
      'access_token' : tokens.access_token,
      'refresh_token' : tokens.refresh_token
    }
    let dynamo = await updateDynamo(auth);
    respond({ status: 200, body: {authData: auth, stored: dynamo}});
  } catch(err) {
    console.log(err);
    respond({ status: 422, body: err });
  }
}
