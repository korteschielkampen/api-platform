import { asyncify, map } from 'async'
import { promisify } from 'util'
const pmap = promisify(map)

import readSalesDay from './read-salesday.js'
import readItemIDs from '../transformation/lightspeed-sales--to--sold-items.js'
import readItems from '../api/lightspeed/read-items.js'
import readCategoryValue from '../transformation/lightspeed-items--to--category-report.js'

export default async datesArray => {
  // Get itemID's from salesday
  let salesDay = await pmap(datesArray, asyncify(readSalesDay))
  let itemIDsValue = readItemIDs(salesDay[0])

  let count = 0
  itemIDsValue.map(value => {
    count += parseInt(value.value)
  })
  console.log(count)

  let itemIDs = itemIDsValue.map(item => {
    return item.id
  })
  let items = await readItems(itemIDs)
  let categoryReport = readCategoryValue(items, itemIDsValue)

  return categoryReport
}
