const fetch = require('node-fetch');
import readAccessToken from '../../auth/lightspeed/read-access-token.js'
import request from '../../general/request.js';

export default async (dates) => {
  let access_token = readAccessToken();
  const options = {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  };
  const apiUrl = `https://api.lightspeedapp.com/API/Account/159502/Sale.json?load_relations=["SaleLines"]&orderby=completeTime&orderby_desc=1&timeStamp=><,${dates.start},${dates.end}`;

  request(apiUrl, options);
}
