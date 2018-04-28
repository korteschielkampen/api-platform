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
    // let account = await readAccount("eebd32a1070b07a8cc835ec15d7752d5fdc7501e1965ac393b638d91b4c5cbd4");
    let account = await readAccount(tokens.access_token);
    // let authData = {
    //   'account_id' : parseInt(account.Account.accountID),
    //   'account_name' : account.Account.name,
    //   'account_link' : account.Account.link['@attributes'].href,
    //   'access_token' : tokens.access_token,
    //   'refresh_token' : tokens.refresh_token
    // }
    // let dynamo = await updateDynamo(authData);

    respond({ status: 422, body: {account: account}});
    // respond({ status: 200, body: {authData: authData}});
    // respond({ status: 200, body: {authData: authData, stored: dynamo}});

  } catch(err) {
    respond({ status: 422, body: err });
  }
}

// {"tokens":{
//   "access_token":"eebd32a1070b07a8cc835ec15d7752d5fdc7501e1965ac393b638d91b4c5cbd4",
//   "token_type":"bearer",
//   "refresh_token":"aeea3743caa5cf6ee1cbdfd815b6b0a7d060ce76b5acc2097e4951dfa959ea14",
//   "scope":"sales_invoices bank",
//   "created_at":1524928069}}
