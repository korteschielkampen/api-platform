import fetch from 'node-fetch'
import readDynamo from './auth/dynamo/read.js'
import updateDynamo from './auth/dynamo/update.js'
import refreshTokens from './auth/lightspeed/refresh-tokens.js'
import readTax from './api/lightspeed/read-reports-taxbyday.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  try {
    // Authentication and updating
    let authData = await readDynamo(159502);
    let tokens = await refreshTokens(authData.refresh_token);
    if (authData.access_token !== tokens.access_token) {
      updateDynamo({...authData, access_token: tokens.access_token});
    }

    // Get tax data
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    startDate = startDate.toISOString();
    const endDate = (new Date).toISOString();

    const dates = {start: startDate, end: endDate};
    let taxData = await readTax(tokens.access_token, dates);

    console.log("----------TAX--DATA------------")
    console.log(taxData)
    console.log("----------TAX--DATA------------")

    respond({
      status: 200,
      body: {
        authData: {
          ...authData,
          expires_in: tokens.expires_in},
        taxData: {
          ...taxData
        }
      }
    });

  } catch(err) {
    respond({ status: 422, body: err });
  }
}
