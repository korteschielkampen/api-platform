import moment from 'moment'

import lightspeedRead from './action/lightspeed-read.js'
import postBusinessReport from './action/create-business-report.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }

  try {
    // Select today
    let datesArray = [{ date: moment().format(), lsRefresh: false }]

    // Read dayreport from Lightspeed
    let dayreports = await lightspeedRead(datesArray)

    // Post to Slack
    const postedReport = await postBusinessReport(dayreports[0])

    console.log('DONE')
    console.log(postedReport)

    respond({ status: 200, body: { message: 'succes' } })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
