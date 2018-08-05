import fs from 'fs'
import updateS3 from '../store/s3/integration-platform-data/update.js'

import readSales from '../api/lightspeed/read-sales.js'
import readSaleLines from '../api/lightspeed/read-salelines.js'
import readItems from '../api/lightspeed/read-items.js'
import readCategories from '../api/lightspeed/read-categories.js'
import getSoldItems from '../models/item/statistics-sales-byitem.js'

const readers = {
  sales: readSales,
  salelines: readSaleLines,
  items: readItems,
  categories: readCategories,
}

const storeDataLocal = (datatype, data) => {
  console.log(`---> ${datatype} start`)
  let json = JSON.stringify(data)
  fs.writeFileSync(`./static/data/${datatype}.json`, json, 'utf8')
  console.log(`---> ${datatype} done`)
  return data
}

export default async datatype => {
  let data = {}
  if (readers[datatype]) {
    // storeDataLocal(datatype, await readers[datatype]({}))
    updateS3(datatype, await readers[datatype]({}))
  } else if (datatype == 'all') {
    console.log('--> All starting')
    if (true) {
      console.log('--> Storing locally')
      storeDataLocal('Sales', await readSales({}))
      storeDataLocal('Items', await readItems({}))
      storeDataLocal('Categories', await readCategories({}))
      console.log('--> Done')
    } else {
      console.log('--> Storing in S3')
      updateS3(datatype, await readers['sales']({}))
      updateS3(datatype, await readers['items']({}))
      updateS3(datatype, await readers['categories']({}))
      console.log('--> Done')
    }
  }
  return await data
}
