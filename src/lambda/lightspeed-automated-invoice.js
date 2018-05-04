import moment from 'moment'

import lightspeedRead from './action/lightspeed-read.js'
import moneybirdCreate from './action/moneybird-create.js'

exports.handler = async (event, context, callback) => {
  try {
    // Setup variables
    let datesArray = [{ date: moment().format(), lsRefresh: true }]

    // Read dayreport from Lightspeed
    let dayreports = await lightspeedRead(datesArray)

    // Create invoice at Moneybird
    await moneybirdCreate(dayreports[0])

    console.log('everything is done')
    callback(null, { message: 'succes', event })
  } catch (err) {
    console.log(err)
    callback(null, { message: 'error', event })
  }
}
