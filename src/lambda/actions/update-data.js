import fs from 'fs'
import moment from 'moment'

import readData from './read-data.js'
import updateS3 from '../store/s3/integration-platform-data/update.js'
import readSales from '../api/lightspeed/read-sales.js'
import readItems from '../api/lightspeed/read-items.js'
import readCategories from '../api/lightspeed/read-categories.js'

const readers = {
  sales: readSales,
  items: readItems,
  categories: readCategories,
}

export default async (datatype, time) => {
  let data = {}
  let readerList = []
  if (readers[datatype]) {
    readerList.push(datatype)
  } else if (datatype === 'all') {
    readerList = readerList.concat(Object.keys(readers))
  }

  let timeStamp
  if (time === 'year') {
    timeStamp = { start: moment().startOf('y'), end: moment().endOf('y') }
  } else if (time === 'day') {
    timeStamp = { start: moment().startOf('d'), end: moment().endOf('d') }
    data = await readData('all')
  }

  console.log('--> Start reading')
  readerList.map(async r => {
    if (readers[r]) {
      console.log(`--> ${r} starting`)
      let tempData = await readers[r]({ timeStamp: timeStamp })
      console.log(`--> ${r} merging`)
      let mergedData = [
        ...(data[r] ? data[r] : []),
        ...(tempData ? tempData : []),
      ]
      console.log(`--> ${r} uniq`)
      data[r] = [...new Set(mergedData)]
      console.log(`--> ${r} storing`)
      await updateS3(r, data[r])
      console.log(`--> ${r} done!`)
    }
  })

  return await data
}
