import readSalesDay from './read-salesday.js'
import getSoldItems from '../transformation/lightspeed-sales--to--sold-items.js'
import readItems from '../api/lightspeed/read-items.js'
import readCategoryValue from '../transformation/lightspeed-items--to--category-report.js'

export default async (sales, items, soldItems) => {
  return readCategoryValue(items, soldItems)
}
