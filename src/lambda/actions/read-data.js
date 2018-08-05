import fs from 'fs'
import readS3 from '../store/s3/integration-platform-data/read.js'

const readers = {
  sales: true,
  items: true,
  categories: true,
}

export default async datatype => {
  let data = {}
  if (readers[datatype]) {
    data[datatype] = await readS3(datatype)
  } else if (datatype == 'all') {
    data.sales = await readS3('sales')
    data.items = await readS3('items')
    data.categories = await readS3('categories')
  }
  return await data
}
