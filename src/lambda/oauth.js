import MoneybirdCreateToken from './api/moneybird-auth/create-token.js'
import MoneybirdReadAccount from './api/moneybird/read-administration.js'
import LightspeedCreateToken from './api/lightspeed-auth/create-token.js'
import LightspeedReadAccount from './api/lightspeed/read-account.js'
import SlackCreateToken from './api/slack-auth/create-token.js'
import updateDynamo from './store/dynamo/auth/update.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }

  try {
    let oauth = event.queryStringParameters
    let tokens, account
    switch (oauth.state) {
      case 'Moneybird':
        console.log('Moneybird authentication is starting')
        tokens = await MoneybirdCreateToken(oauth.code)
        account = await MoneybirdReadAccount(tokens.access_token)
        await updateDynamo({
          account_id: account[0].id,
          account_name: account[0].name,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        })
        console.log('Moneybird authentication is done')
        break
      case 'Lightspeed':
        console.log('Lightspeed authentication is starting')
        tokens = await LightspeedCreateToken(oauth.code)
        account = await LightspeedReadAccount(tokens.access_token)
        await updateDynamo({
          account_id: account.Account.accountID,
          account_name: account.Account.name,
          account_link: account.Account.link['@attributes'].href,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        })
        console.log('Lightspeed authentication is done')
        break
      case 'Slack':
        console.log('Slack authentication is starting')
        account = await SlackCreateToken(oauth.code)
        await updateDynamo({
          access_token: account.access_token,
          account_id: 'korteschiel-3',
          app_id: account.app_id,
          app_user_id: account.app_user_id,
          team_id: account.team_id,
          team_name: account.team_name,
        })
        console.log('Slack authentication is done')
        break
      default:
        console.log('Onbekende oauth provider')
        throw { message: 'Platform: Onbekende oauth provider' }
    }

    respond({ status: 200, body: { message: 'succes' } })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
