import _ from 'lodash'

import readSalesDay from './api/lightspeed/read-sales-day.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  try {
    let sales = await readSalesDay(JSON.parse(event.body).date);

    respond({
      status: 200,
      body: {
        ...sales
      }
    });
  } catch(err) {
    console.log(err);
    respond({ status: 422, body: err });
  }
}
