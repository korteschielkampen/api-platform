import fetch from 'node-fetch'
import _ from 'lodash'

import readDynamo from './auth/dynamo/read.js'
import updateDynamo from './auth/dynamo/update.js'
import refreshTokens from './auth/moneybird/refresh-tokens.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  try {
    // Authentication and updating
    let auth = await readDynamo(211688738215954180);
    console.log(auth)
    let tokens = await refreshTokens(auth.refresh_token);
    console.log(tokens)
    if (auth.access_token !== tokens.access_token) {
      updateDynamo({...auth, access_token: tokens.access_token});
    }

    respond({
      status: 200,
      body: {
        authData: {
          truncated: "A lot here, but not for the client to view"
        }
      }
    });

  } catch(err) {
    respond({ status: 422, body: err });
  }
}
