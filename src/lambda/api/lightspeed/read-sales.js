import _ from 'lodash'
import moment from 'moment'
import strictUriEncode from 'strict-uri-encode'
import { asyncify, timesLimit } from 'async'
import { promisify } from 'util'
const ptimesLimit = promisify(timesLimit)

import request from './request-lightspeed.js'
import readAccessToken from '../lightspeed-auth/read-token.js'
import cleanSales from './clean-sales.js'

export default async ({
  dates = {
    start: moment().startOf('year'),
    end: moment(),
  },
} = {}) => {
  // Encode dates properly
  dates = {
    start: strictUriEncode(
      moment(dates.start)
        .startOf('day')
        .format('YYYY-MM-DDTHH:mm:ssZ')
    ),
    end: strictUriEncode(
      moment(dates.end)
        .endOf('day')
        .format('YYYY-MM-DDTHH:mm:ssZ')
    ),
  }

  // Auth and header stuff
  let access_token = await readAccessToken()
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }

  let account = 159502
  let relations = JSON.stringify(['SaleLines', 'SalePayments'])
  let apiUrl = `https://api.lightspeedapp.com/API/Account/${account}/Sale.json?load_relations=${relations}&timeStamp=><,${
    dates.start
  },${dates.end}`

  // Get saleslines
  let attributes = (await request(apiUrl, options, 1))['@attributes']
  let count = parseInt(attributes.count)
  let limit = parseInt(attributes.limit)
  let sales = []
  await ptimesLimit(
    Math.ceil(count / limit),
    10,
    asyncify(async i => {
      let offset = i * limit
      apiUrl = apiUrl + `&offset=${offset}`
      let tempSales = await request(apiUrl, options, 1)
      if (tempSales.Sale) {
        sales = _.concat(sales, tempSales.Sale)
      }
    })
  )

  return sales.length > 0 && cleanSales(await sales)
}
