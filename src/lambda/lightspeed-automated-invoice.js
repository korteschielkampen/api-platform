import moment from 'moment'

import createBusinessReport from './action/create-business-report.js'
import moneybirdCreate from './action/create-moneybird.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }

  try {
    // Setup variables
    let datesArray = _.times(1, i => {
      return {
        date: moment().format(),
        lsRefresh: true,
        delay: 2000 * i,
      }
    })

    let postSlack = {
      post: false,
      channel: 'CAPCPRW6B',
    }

    let dayReports = await createBusinessReport(datesArray, postSlack)

    // Create invoice at Moneybird
    await moneybirdCreate(dayReports[0])

    console.log('everything is done')
    respond({ status: 200, body: { message: 'succes' } })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
