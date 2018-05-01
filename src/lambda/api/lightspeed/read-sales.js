import moment from 'moment';
import strictUriEncode from 'strict-uri-encode';

import readAccessToken from '../../auth/lightspeed/read-access-token.js'
import request from '../../general/request.js';

export default async (inputDate) => {
  let dates = {
    start:  strictUriEncode(moment(inputDate).startOf("d").format("YYYY-MM-DDTHH:mm:ssZ")),
    end: strictUriEncode(moment(inputDate).endOf("d").format("YYYY-MM-DDTHH:mm:ssZ"))
  };

  let access_token = await readAccessToken();
  const options = {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  };
  const apiUrl = `https://api.lightspeedapp.com/API/Account/159502/Sale.json?load_relations=["SaleLines"]&orderby=completeTime&orderby_desc=1&timeStamp=><,${dates.start},${dates.end}`;

  return await request(apiUrl, options);
}
