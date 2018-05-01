import _ from 'lodash'

import readSalesDay from './api/lightspeed/read-sales-day.js'
import updateDynamo from './general/dynamo/update.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  try {
    let date = JSON.parse(event.body).date;
    let sales = await readSalesDay(date);

    _.each(sales, (sale)=>{
      _.each(sale, (value, key)=>{
        console.log(key, ": ", value)
        if (value === "" || value === null) {
          delete sale[key];
        }
      })
    })

    var params = {
      TableName: 'lightspeed-sales-day',
      Item: {
        timeStamp: date,
        sales: sales
      }
    };
    let dbStatus = updateDynamo(params);

    respond({
      status: 200,
      body: {
        sales: {
          ...sales
        },
        dbStatus: dbStatus
      }
    });

  } catch(err) {
    console.log(err);
    respond({ status: 422, body: err });
  }

}
