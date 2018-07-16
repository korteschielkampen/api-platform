import moment from 'moment'
import fs from 'fs'

import readSales from './api/lightspeed/read-sales.js'
import readSaleLines from './api/lightspeed/read-salelines.js'
import readItems from './api/lightspeed/read-items.js'
import readCategories from './api/lightspeed/read-categories.js'

const readers = {
  sales: readSales,
  salelines: readSaleLines,
  items: readItems,
  categories: readCategories,
}

const storeData = async (datatype, data) => {
  console.log('-----start-----')
  let json = JSON.stringify(await data)
  fs.writeFile(`./static/data/${datatype}.json`, json, 'utf8', () => {
    console.log(`-----${datatype} finnally done-----`)
  })
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
    storeData(datatype, await readers[datatype]({}))

    respond({
      status: 200,
      body: { message: 'request received' },
    })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
