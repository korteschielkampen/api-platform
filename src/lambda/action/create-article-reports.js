import getSoldItems from '../transformation/lightspeed-sales--to--sold-items.js'
import readItems from '../api/lightspeed/read-items.js'
import createArticleReport from '../transformation/lightspeed-items--to--article-report.js'

export default async sales => {
  // Get itemID's from salesday
  let soldItems = getSoldItems(sales)
  let items = await readItems(soldItems)
  let articleReport = createArticleReport(items, soldItems)

  return articleReport
}
