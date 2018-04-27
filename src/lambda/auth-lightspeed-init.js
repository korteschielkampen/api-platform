import fetch from 'node-fetch'
import createTokens from './auth/lightspeed/create-tokens.js'
import readAccount from './api/lightspeed/read-account.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  try {
    var tokens = await createTokens(event.queryStringParameters.code, respond);
    var account = await readAccount(tokens, respond);
    respond({ status: 200, body: {tokens: tokens, account: account}});
  } catch(err) {
    respond({ status: 422, body: {error: err}});
  }
}
