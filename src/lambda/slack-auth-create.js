import createToken from './api/slack-auth/create-token.js'
// import readAccount from './api/slack/read-administration.js'
import updateDynamo from './store/dynamo/auth/update.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }

  try {
    let slackAuth = await createToken(event.queryStringParameters.code)
    console.log(slackAuth)
    let auth = {
      access_token: slackAuth.access_token,
      account_id: 'korteschiel-3',
      app_id: slackAuth.app_id,
      app_user_id: slackAuth.app_user_id,
      team_id: slackAuth.team_id,
      team_name: slackAuth.team_name,
    }
    let dynamo = await updateDynamo(auth)

    respond({ status: 200, body: { message: 'succes' } })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
