import moneybirdCreate from './action/moneybird-create.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }

  try {
    // Parse payload
    const dayreport = JSON.parse(event.body)

    await moneybirdCreate(dayreport)

    respond({
      status: 200,
      body: {
        message: 'Invoice is succesfully created',
      },
    })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
