import createBusinessReport from './action/create-business-report.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }

  try {
    // ERRORRRRRRR NOT PARSING INPUT AND NOT OUTPUTTING RIGHT FORMAT
    // let datesArray = JSON.parse(event.body).datesArray

    let datesArray = _.times(7, i => {
      return {
        date: moment().format(),
        lsRefresh: true,
        delay: 2000 * i,
      }
    })

    let postSlack = {
      post: true,
      channel: 'CAPCPRW6B',
    }

    let dayReports = await createBusinessReport(datesArray, postSlack)

    respond({
      status: 200,
      body: {
        dayreports: dayReports,
      },
    })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
