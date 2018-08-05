import fs from 'fs'

import updateS3 from '../store/s3/integration-platform-data/update.js'
import readSales from '../api/lightspeed/read-sales.js'
import readItems from '../api/lightspeed/read-items.js'
import readCategories from '../api/lightspeed/read-categories.js'

const readers = {
  sales: readSales,
  items: readItems,
  categories: readCategories,
}

// const storeDataLocal = (datatype, data) => {
//   console.log(`---> ${datatype} start`)
//   let json = JSON.stringify(data)
//   fs.writeFileSync(`./static/data/${datatype}.json`, json, 'utf8')
//   console.log(`---> ${datatype} done`)
//   return data
// }

export default async datatype => {
  let data = {}

  if (readers[datatype]) {
    // storeDataLocal(datatype, await readers[datatype]({}))
    updateS3(datatype, await readers[datatype]({}))
  } else if (datatype == 'all') {
    console.log('--> All starting')
    console.log('--> Sales')
    data.sales = await readers['sales']({})
    console.log('--> Items')
    data.items = await readers['items']({})
    console.log('--> Categories')
    data.categories = await readers['categories']({})
    console.log('--> Done')

    // console.log('--> Storing locally')
    // storeDataLocal('Sales', data.sales)
    // storeDataLocal('Items', data.items)
    // storeDataLocal('Categories', data.categories)
    // console.log('--> Done')

    console.log('--> Storing in S3')
    updateS3(datatype, data.sales)
    updateS3(datatype, data.items)
    updateS3(datatype, data.categories)
    console.log('--> Done')
  }
  return await data
}
