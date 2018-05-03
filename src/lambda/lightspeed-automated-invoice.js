import _ from 'lodash'
import moment from 'moment'
import {asyncify, map} from 'async'
import {promisify} from 'util'
const pmap = promisify(map);

import readSalesDay from './api/lightspeed/read-salesday.js'
import updateDynamo from './store/dynamo/salesday/update.js'
import readDynamo from './store/dynamo/salesday/read.js'
import calculateDayreport from './transformation/lightspeed-sales--to--dayreport.js'
import moneybirdCreate from './action/moneybird-create.js'

exports.handler = async (event, context, callback) => {
  try {
    // Setup variables
    let date = moment().startOf('day').format();

    // Download sales from Lightspeed and put in Dynamo
    console.log("request lightspeed")
    let sales = await readSalesDay(date);

    // Sending it to dynamo for admin usage
    console.log("update dynamo")
    let salesDay = await updateDynamo(sales, date);

    // Calculate the dayreport
    console.log("calculate dayreturn")
    let dayreport = {
      date: date,
      ...calculateDayreport(salesDay)
    }

    await moneybirdCreate(dayreport);

    console.log("everything is done")

    callback(null, { message: 'succes', event });

  } catch(err) {
    console.log(err);
    callback(null, { message: 'error', event });
  }
}
