import moment from 'moment'

import readDayreports from './action/read-financial-reports.js'
import moneybirdCreate from './action/create-moneybird.js'

exports.handler = async (event, context, callback) => {
  try {
    // Setup variables
    let datesArray = [{ date: moment().format(), lsRefresh: true }]

    // Read dayreport from Lightspeed
    let dayreports = await readDayreports(datesArray)

    // Create invoice at Moneybird
    await moneybirdCreate(dayreports[0])

    console.log('everything is done')
    callback(null, { message: 'succes', event })
  } catch (err) {
    console.log(err)
    callback(null, { message: 'error', event })
  }
}
