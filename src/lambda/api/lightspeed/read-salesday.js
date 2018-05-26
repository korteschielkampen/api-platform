import _ from 'lodash'
import moment from 'moment'
import strictUriEncode from 'strict-uri-encode'

import request from '../general/request.js'
import readAccessToken from '../lightspeed-auth/read-token.js'

export default async inputDate => {
  console.log('Reading sales from Lightspeed')
  let dates = {
    start: strictUriEncode(
      moment(inputDate)
        .startOf('d')
        .format('YYYY-MM-DDTHH:mm:ssZ')
    ),
    end: strictUriEncode(
      moment(inputDate)
        .endOf('d')
        .format('YYYY-MM-DDTHH:mm:ssZ')
    ),
  }

  let access_token = await readAccessToken()
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }

  let sales = []
  let offset = 0
  let count = 1
  while (offset < count) {
    let apiUrl = `https://api.lightspeedapp.com/API/Account/159502/Sale.json?load_relations=["SaleLines","SalePayments"]&offset=${offset}&timeStamp=><,${
      dates.start
    },${dates.end}`
    let tempSales = await request(apiUrl, options)
    if (tempSales.Sale) {
      sales = _.concat(sales, tempSales.Sale)
    }
    count = parseInt(tempSales['@attributes'].count)
    offset += parseInt(tempSales['@attributes'].limit)
  }

  return sales.length > 0 && sales
}
