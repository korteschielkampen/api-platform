import createToken from './api/slack-auth/create-token.js'
import updateDynamo from './store/dynamo/auth/update.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }

  try {
    console.log('hi')
    console.log('hi')
    console.log('hi')
    console.log('hi')

    respond({ status: 200, body: { message: 'succes' } })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
