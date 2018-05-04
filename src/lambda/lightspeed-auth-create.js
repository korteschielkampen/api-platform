import createToken from './api/lightspeed-auth/create-token.js'
import readAccount from './api/lightspeed/read-account.js'
import updateDynamo from './store/dynamo/auth/update.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }

  try {
    let token = await createToken(event.queryStringParameters.code)
    let account = await readAccount(token.access_token)
    let auth = {
      account_id: account.Account.accountID,
      account_name: account.Account.name,
      account_link: account.Account.link['@attributes'].href,
      access_token: token.access_token,
      refresh_token: token.refresh_token,
    }
    let dynamo = await updateDynamo(auth)

    respond({ status: 200, body: { message: 'succes' } })
    // respond({ status: 200, body: { authData: auth, stored: dynamo } })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
