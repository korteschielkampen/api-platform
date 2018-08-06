import util from 'util'
import _ from 'lodash'
import moment from 'moment'

import createMergedItems from '../models/item/merged-items.js'
import updateItems from './update-items.js'

import getSaleStatsByItem from '../models/item/statistics-sales-byitem.js'
import createStockStatistics from '../models/item/statistics-stock.js'

export default (sales, items) => {
  console.log('Calulating reorderpoints')
  // Make sure to seperate sales in months
  let dates = {
    start: moment().subtract(6, 'months'),
    end: moment(),
  }

  let reorderSales = _.filter(sales, sale => {
    return moment(sale.completeTime).isBetween(dates.start, dates.end)
  })

  // Merge saleslines with items
  let reorderSaleStatsByItem = getSaleStatsByItem(reorderSales)
  let reorderItems = createMergedItems(reorderSaleStatsByItem, items)

  // Setting reorderpoint to half
  return createStockStatistics(reorderItems)
}
