import _ from 'lodash'

import readSalesDay from './api/lightspeed/read-sales-day.js'
import updateDynamo from './general/dynamo/update.js'
import readDynamo from './general/dynamo/read.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  try {
    let date = JSON.parse(event.body).date;
    let lsRequested = false;

    // Download day from Dynamo
    var params = {
      TableName: 'lightspeed-sales-day',
      Key: {
        "timeStamp": date,
      }
    };
    let salesDay = await readDynamo(params);

    //  When not in Dynamo download from Lightspeed and put in Dynamo
    let lsRequest = !salesDay;
    if (lsRequest) {
      lsRequested = true;
      let sales = await readSalesDay(date);

      _.each(sales, (sale)=>{
        _.each(sale, (value, key)=>{
          console.log(key, ": ", value)
          if (value === "" || value === null) {
            delete sale[key];
          }
        })
      })

      salesDay = {
        TableName: 'lightspeed-sales-day',
        Item: {
          timeStamp: date,
          sales: sales
        }
      };
      await updateDynamo(salesDay);
      salesDay = salesDay.Item
    }

    respond({
      status: 200,
      body: {
        sales: {
          ...salesDay
        },
        lightspeed: lsRequested
      }
    });

  } catch(err) {
    console.log(err);
    respond({ status: 422, body: err });
  }

}
