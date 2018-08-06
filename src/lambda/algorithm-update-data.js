import updateData from './actions/update-data.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }
  try {
    let dataType, dataTimeStamp

    if (event) {
      dataType = event.queryStringParameters.datatype
      dataTimeStamp = event.queryStringParameters.dataTimeStamp
    } else {
      dataType = 'all'
      dataTimeStamp = 'day'
    }

    console.log(
      '---> Activating updateData with type: ',
      dataType,
      ' and timestamp: ',
      dataTimeStamp
    )

    if (!callback) {
      var callback = () => {}
    }

    updateData(dataType, dataTimeStamp)

    respond({
      status: 201,
      body: { message: 'request received' },
    })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
