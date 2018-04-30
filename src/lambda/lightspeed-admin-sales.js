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
    
    let sales = await readSales(JSON.parse(event.body).date);

    respond({
      status: 200,
      body: {
        ...sales
      }
    });
  } catch(err) {
    respond({ status: 422, body: err });
  }
}
