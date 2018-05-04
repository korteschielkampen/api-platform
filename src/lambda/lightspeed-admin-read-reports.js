import lightspeedRead from './action/lightspeed-read.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }

  try {
    let datesArray = JSON.parse(event.body).datesArray

    let dayreports = await lightspeedRead(datesArray)

    respond({
      status: 200,
      body: {
        dayreports: dayreports,
      },
    })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
