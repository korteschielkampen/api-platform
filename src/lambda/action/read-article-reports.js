import { asyncify, map } from 'async'
import { promisify } from 'util'
const pmap = promisify(map)

import readSalesDay from './read-salesday.js'
import getSoldItems from '../transformation/lightspeed-sales--to--sold-items.js'
import readItems from '../api/lightspeed/read-items.js'
import createArticleReport from '../transformation/lightspeed-items--to--article-report.js'

export default async datesArray => {
  // Get itemID's from salesday
  let salesDay = await pmap(datesArray, asyncify(readSalesDay))
  let soldItems = getSoldItems(salesDay[0])
  let items = await readItems(soldItems)
  let articleReport = createArticleReport(items, soldItems)

  return articleReport
}
