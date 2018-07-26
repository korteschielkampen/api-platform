export default (saleStatsByItem, items, options) => {
  // Making a dictionairy (not expanding with spread and literal 'cuz perf)
  let saleStatsByItemHashed = saleStatsByItem.reduce((acc, i) => {
    acc[i.itemID] = i
    return acc
  }, {})

  // Do the actual merging by reduce, but use the dictionary for quick search
  let mergedItems = items.reduce((acc, i) => {
    if (saleStatsByItemHashed[i.itemID]) {
      acc.push({
        ...saleStatsByItemHashed[i.itemID],
        ...i,
      })
    } else if (
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
  }, [])
  return mergedItems
}
