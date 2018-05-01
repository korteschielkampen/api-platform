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

  let sales = [];
  let offset = 0;
  let count = 1;
  while (offset < count) {
    let apiUrl = `https://api.lightspeedapp.com/API/Account/159502/Sale.json?load_relations=["SaleLines","SalePayments"]&offset=${offset}&timeStamp=><,${dates.start},${dates.end}`;
    let tempSales = await request(apiUrl, options);
    sales = _.concat(sales, tempSales.Sale);
    count = parseInt(tempSales["@attributes"].count);
    offset += parseInt(tempSales["@attributes"].limit);
  }

  return await sales;
}
