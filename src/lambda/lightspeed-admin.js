import fetch from 'node-fetch'
import readDynamo from './auth/dynamo/read.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  try {
    let authData = await readDynamo(159502);  // Read Lightspeed from Dynamo
    // let moneyBirdAuth = await readDynamo(1892373);  // Read Moneybird from Dynamo
    respond({ status: 200, body: {authData: authData}});

  } catch(err) {
    respond({ status: 422, body: err });
  }

}
