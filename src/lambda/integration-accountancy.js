import moment from 'moment'

import createBusinessReport from './actions/create-business-report.js'
import moneybirdCreate from './actions/create-moneybird.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }

  try {
    // Setup date
    let dates = event.queryStringParameters.date
      ? {
          start: moment(event.queryStringParameters.date)
            .startOf('day')
            .format(),
          end: moment(event.queryStringParameters.date)
            .endOf('day')
            .format(),
        }
      : {
          start: moment()
            .startOf('day')
            .format(),
          end: moment()
            .endOf('day')
            .format(),
        }

    let postSlack = {
      post: false,
      channel: 'G8ZUNLXC5',
    }

    // Generate business reports by day
    let dayReports = await createBusinessReport(dates, postSlack)
    // Create invoice at Moneybird
    await moneybirdCreate(dayReports[0])

    console.log('everything is done')
    respond({ status: 200, body: { message: 'succes' } })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
