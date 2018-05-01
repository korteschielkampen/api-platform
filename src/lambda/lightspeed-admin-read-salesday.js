import _ from 'lodash'
import moment from 'moment';

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
    // Read from Dynamo
    let date = moment(JSON.parse(event.body).date).startOf('day').format();
    let lsRequested = false;
    let salesDay = await readDynamo(date);

    //  When not in Dynamo download from Lightspeed and put in Dynamo
    if (!salesDay) {
      lsRequested = true;
      let sales = await readSalesDay(date);
      salesDay = await updateDynamo(sales, date);
    }

    let dayreport = calculateDayreport(salesDay);

    respond({
      status: 200,
      body: {
        dayreport: dayreport,
        lightspeed: lsRequested
      }
    });

  } catch(err) {
    console.log(err);
    respond({ status: 422, body: err });
  }

}
