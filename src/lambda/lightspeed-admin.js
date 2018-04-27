import fetch from 'node-fetch'
import readDynamo from './auth/dynamo/read.js'
import updateDynamo from './auth/dynamo/update.js'
import refreshTokens from './auth/lightspeed/refresh-tokens.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  try {
    let authData = await readDynamo(159502);
    let tokens = await refreshTokens(authData.refresh_token);

    if (authData.access_token !== tokens.access_token) {
      updateDynamo({...authData, access_token: tokens.access_token});
    }

    respond({ status: 200, body: {authData: {...authData, expires_in: tokens.expires_in}}});
    
  } catch(err) {
    respond({ status: 422, body: err });
  }
}
