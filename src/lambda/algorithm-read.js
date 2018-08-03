import readData from './actions/read-lightspeed.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }
  try {
    let datatype = event.queryStringParameters.datatype
    readData(datatype)
    respond({
      status: 201,
      body: { message: 'request received' },
    })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
