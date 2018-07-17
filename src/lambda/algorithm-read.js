import moment from 'moment'
import fs from 'fs'
import _ from 'lodash'
import util from 'util'

import readSales from './api/lightspeed/read-sales.js'
import readSaleLines from './api/lightspeed/read-salelines.js'
import readItems from './api/lightspeed/read-items.js'
import readCategories from './api/lightspeed/read-categories.js'
import getSoldItems from './models/sales/sold-items.js'

const readers = {
  sales: readSales,
  salelines: readSaleLines,
  items: readItems,
  categories: readCategories,
}

const storeData = (datatype, data) => {
  console.log(`---> ${datatype} start`)
  let json = JSON.stringify(data)
  fs.writeFileSync(`./static/data/${datatype}.json`, json, 'utf8')
  console.log(`---> ${datatype} done`)
  return data
}

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }

  try {
    // Up front because takes to long
    let datatype = event.queryStringParameters.datatype
    if (readers[datatype]) {
      storeData(datatype, await readers[datatype]({}))
    } else if (datatype == 'sunburst') {
      console.log('--> Sunburst starting')
      let sales = storeData('Sales', await readSales())
      let soldItems = getSoldItems(sales)
      storeData('Items', await readItems({ itemIDs: soldItems }))
      storeData('Categories', await readCategories())
    }

    respond({
      status: 200,
      body: { message: 'request received' },
    })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
