import fetch from 'node-fetch'

import readSales from './api/lightspeed/read-sales.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  try {
    // Read sales from dates
    let dates = {
      start: "2018-04-30T00:00:00-02:00",
      end: "2018-04-31T00:00:00-02:00"
    };
    let sales = readSales(dates)

    respond({
      status: 200,
      body: {
        sales: sales
      }
    });
  } catch(err) {
    respond({ status: 422, body: err });
  }
}
