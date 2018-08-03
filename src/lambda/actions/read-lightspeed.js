import fs from 'fs'

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
    storeDataLocal(datatype, await readers[datatype]({}))
  } else if (datatype == 'all') {
    console.log('--> Sunburst starting')
    data.sales = storeDataLocal('Sales', await readSales())
    data.items = storeDataLocal('Items', await readItems({}))
    data.categories = storeDataLocal('Categories', await readCategories())
  }
  return await data
}
