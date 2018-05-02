import _ from 'lodash'
import moment from 'moment'
import {asyncify, map} from 'async'
import {promisify} from 'util'
const pmap = promisify(map);

import readSalesDay from './api/lightspeed/read-sales-day.js'
import updateDynamo from './api/dynamo/update-sales.js'
import readDynamo from './api/dynamo/read-sales.js'
import calculateDayreport from './general/calculate/dayreport.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  try {
    let datesArray = (JSON.parse(event.body)).datesArray;

    let dayreports = await pmap(datesArray, asyncify(async (dateObject, key) => {
      // Setup variables
      let date = moment(dateObject.date).format();
      let lsRequested = false;
      let salesDay;

      // Read from Dynamo
      if (!dateObject.lsRefresh){
        console.log("Request Dynamo")
        salesDay = await readDynamo(date);
      }

      // When not in Dynamo download from Lightspeed and put in Dynamo
      if (!salesDay || dateObject.lsRefresh) {
        lsRequested = true;
        console.log("Request Lightspeed")
        let sales = await readSalesDay(date);
        console.log("Update Dynamo")
        salesDay = await updateDynamo(sales, date);
      }

      // Calculate the dayreport
      console.log("Calculate Dayreturn")
      let dayreport = {
        date: date,
        lsRequested: lsRequested,
        ...calculateDayreport(salesDay)
      }
      return dayreport
    }));

    respond({
      status: 200,
      body: {
        dayreports: dayreports
      }
    });

  } catch(err) {
    console.log(err);
    respond({ status: 422, body: err });
  }

}
