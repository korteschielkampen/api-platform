import _ from 'lodash'
import moment from 'moment'
import {asyncify, times} from 'async'
import {promisify} from 'util'
const patimes = promisify(times);

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
    let dates = {
      start: moment(JSON.parse(event.body).dates.start).startOf('day'),
      end:  moment(JSON.parse(event.body).dates.end).startOf('day')
    }
    let datesArray = [];
    let days = Math.abs(dates.start.diff(dates.end, 'days'));
    console.log(days);

    let dayreports = await patimes(days, asyncify(async (index) => {
      // Setup variables
      let date = dates.start.add(index, 'days').format();
      let lsRequested = false;

      console.log(date)

      // Read from Dynamo
      let salesDay = await readDynamo(date);

      // When not in Dynamo download from Lightspeed and put in Dynamo
      if (!salesDay) {
        lsRequested = true;
        let sales = await readSalesDay(date);
        salesDay = await updateDynamo(sales, date);
      }

      // Calculate the dayreport
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
