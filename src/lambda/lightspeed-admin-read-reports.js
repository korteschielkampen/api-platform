import readDayreports from './action/read-financial-reports.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }

  try {
    let datesArray = JSON.parse(event.body).datesArray

    let dayreports = await readDayreports(datesArray)

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
