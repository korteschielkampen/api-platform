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
    console.log("----------------INVOCATION HMM HMMM----------------")
    let tokens = await createTokens(event.queryStringParameters.code);
    console.log("----------------TOKENS HMM HMMM----------------")
    console.log(tokens)
    console.log("----------------TOKENS HMM HMMM----------------")
    let account = await readAccount(tokens.access_token);
    console.log("----------------ACCOUNT HMM HMMM----------------")
    console.log(account)
    console.log("----------------ACCOUNT HMM HMMM----------------")
    let authData = {
      'account_id' : parseInt(account.account[0].id),
      'account_name' : account.account[0].name,
      'access_token' : tokens.access_token,
      'refresh_token' : tokens.refresh_token
    }
    console.log("----------------AUTHDATA HMM HMMM----------------")
    console.log(authData)
    console.log("----------------AUTHDATA HMM HMMM----------------")
    let dynamo = await updateDynamo(authData);

    respond({ status: 200, body: {authData: authData, stored: dynamo}});
  } catch(err) {
    respond({ status: 422, body: err });
  }
}
