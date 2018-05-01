import moment from 'moment';
import strictUriEncode from 'strict-uri-encode';

import readAccessToken from '../../auth/lightspeed/read-token.js'
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

  let sales = [];
  let offset = 0;
  let count = 1;
  while (offset < count) {
    let tempSales = await request(apiUrl, options);
    sales = _.concat(sales, tempSales);
    count = tempSales["@attributes"].count;
    offset += tempSales["@attributes"].limit;
  }

  return await sales;
}
