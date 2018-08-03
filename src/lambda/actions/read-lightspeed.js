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
    console.log('--> All starting')
    console.log('--> Sales')
    data.sales = await readSales()
    console.log('--> Items')
    data.items = await readItems({})
    console.log('--> Categories')
    data.categories = await readCategories()
    console.log('--> Done')

    if (false) {
      storeDataLocal('Sales', data.sales)
      storeDataLocal('Items', data.items)
      storeDataLocal('Categories', data.categories)
    }
  }
  return await data
}
