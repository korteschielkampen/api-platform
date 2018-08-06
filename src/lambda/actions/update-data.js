import fs from 'fs'
import moment from 'moment'
import isEqual from 'lodash/isEqual'

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

const intersectors = {
  sales: 'saleID',
  items: 'itemID',
  categories: 'categoryID',
}

export default async (datatype, time) => {
  console.time('test')
  let data = {}
  let readerList = []
  if (readers[datatype]) {
    readerList.push(datatype)
  } else if (datatype === 'all') {
    readerList = readerList.concat(Object.keys(readers))
  }

  let timeStamp
  if (time === 'all') {
    timeStamp = {
      start: moment('2017-01-01').startOf('y'),
      end: moment().endOf('y'),
    }
  } else if (time === 'day') {
    timeStamp = { start: moment().startOf('d'), end: moment().endOf('d') }
    data = await readData('all')
  }

  debugger

  console.log('--> Start reading')
  readerList.map(async r => {
    if (readers[r]) {
      console.log(`--> ${r} starting`)
      let tempData = await readers[r]({ timeStamp: timeStamp })

      console.log(`--> ${r} merging -> Getting base data`)
      let baseData = _.differenceBy(
        data[r] ? data[r] : [],
        tempData ? tempData : [],
        intersectors[r]
      )

      console.log(`--> ${r} merging -> Adding new data`)
      let mergedData = [...baseData, ...(tempData ? tempData : [])]

      console.log(`--> ${r} storing`)
      await updateS3(r, mergedData)

      console.log(`--> ${r} done!`)
    }
  })
  console.timeEnd('test')

  return await data
}
