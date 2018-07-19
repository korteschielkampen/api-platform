import _ from 'lodash'

import guessCost from './guess-cost.js'
import getReorderPoint from './reorderpoints.js'

export default (soldItems, items, options) => {
  let itemsHashed = {}
  items.forEach(i => {
    itemsHashed[i.itemID] = i
  })

  items = _.map(soldItems, i => {
    if (itemsHashed[i.itemID]) {
      // Set additional statistics for stock:
      let salesPrice = parseFloat(
        _.find(itemsHashed[i.itemID].Prices.ItemPrice, { useType: 'Default' })
          .amount
      )
      let costCorr = guessCost(
        parseFloat(itemsHashed[i.itemID].avgCost),
        parseFloat(salesPrice)
      )
      i.statistics.totalStock = parseInt(
        _.find(itemsHashed[i.itemID].ItemShops.ItemShop, {
          shopID: '1',
        }).qoh
      )
      i.statistics.totalStockValue = costCorr * i.statistics.totalStock
      if (options.lightweight === false) {
        // return everything
        return {
          ...itemsHashed[i.itemID],
          ...i,
        }
      } else if (options.lightweight === true) {
        // Only return essential values
        return {
          ...i,
          categoryID: itemsHashed[i.itemID].categoryID,
          description: itemsHashed[i.itemID].description,
        }
      }
    } else {
      return i
    }
  })

  return items
}
