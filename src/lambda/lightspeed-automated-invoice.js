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
    let date = moment().format();
    console.log("running!!")
    // When not in Dynamo download from Lightspeed and put in Dynamo
    console.log("request lightspeed")
    // let sales = await readSalesDay(date);

    // console.log(sales)

    //
    // // Sending it to dynamo for admin usage
    // console.log("update dynamo")
    // let salesDay = await updateDynamo(sales, date);
    //
    // // Calculate the dayreport
    // console.log("calculate dayreturn")
    // let dayreport = {
    //   date: date,
    //   ...calculateDayreport(salesDay)
    // }
    //
    // await moneybirdCreate(dayreport);

    callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });

  } catch(err) {
    console.log(err);
    callback(null, { message: 'Damn Serverless v1.0! Your function executed terribly!', event });
  }
}
