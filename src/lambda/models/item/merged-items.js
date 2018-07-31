import _ from 'lodash'

export default (saleStatsByItem, items, options) => {
  // Making a dictionairy (not expanding with spread and literal 'cuz perf)
  let itemsHashed = items.reduce((acc, i) => {
    acc[i.itemID] = i
    return acc
  }, {})

  // Merge item statistics from the salelines
  let mergedSalesItems = saleStatsByItem.reduce((acc, i) => {
    if (itemsHashed[i.itemID]) {
      acc.push({
        ...itemsHashed[i.itemID],
        ...i,
      })
    } else {
      acc.push(i)
    }
    return acc
  }, [])

  // Merge items by stock availability
  let mergedItems = _.differenceBy(items, mergedSalesItems, 'itemID').reduce(
    (acc, i) => {
      if (
        parseInt(i.ItemShops.ItemShop.find(i => i.shopID == '1' && i).qoh) !== 0
      ) {
        acc.push({
          ...i,
          statistics: {
            totalSold: 0,
            totalRevenue: 0,
            totalProfit: 0,
          },
        })
      }
      return acc
    },
    mergedSalesItems
  )
  return mergedItems
}
