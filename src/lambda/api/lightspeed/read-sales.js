import _ from 'lodash'
import moment from 'moment'
import strictUriEncode from 'strict-uri-encode'

import request from './request-lightspeed.js'
import readAccessToken from '../lightspeed-auth/read-token.js'
import cleanSales from './clean-sales.js'

export default async (startDate, endDate) => {
  let dates

  if (startDate) {
    dates = {
      start: strictUriEncode(
        moment(startDate)
          .startOf('d')
          .format('YYYY-MM-DDTHH:mm:ssZ')
      ),
      end: strictUriEncode(
        moment(endDate)
          .endOf('d')
          .format('YYYY-MM-DDTHH:mm:ssZ')
      ),
    }
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
    let apiUrl
    if (startDate) {
      apiUrl = `https://api.lightspeedapp.com/API/Account/159502/Sale.json?load_relations=["SaleLines","SalePayments"]&offset=${offset}&timeStamp=><,${
        dates.start
      },${dates.end}`
    } else {
      apiUrl = `https://api.lightspeedapp.com/API/Account/159502/Sale.json?load_relations=["SaleLines","SalePayments"]&offset=${offset}`
    }

    let tempSales = await request(apiUrl, options, 1)
    if (tempSales.Sale) {
      sales = _.concat(sales, tempSales.Sale)
    }
    count = parseInt(tempSales['@attributes'].count)
    offset += parseInt(tempSales['@attributes'].limit)
  }

  return sales.length > 0 && cleanSales(await sales)
}
