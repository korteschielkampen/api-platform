// Set additional statistics for stock
import cleanCost from './guess-cost.js'

export default items => {
  items = _.map(items, i => {
    if (i.ItemShops) {
      let qoh = parseInt(
        _.find(i.ItemShops.ItemShop, {
          shopID: '1',
        }).qoh
      )
      let salesPrice = parseInt(
        _.find(i.Prices.ItemPrice, { useType: 'Default' }).amount
      )
      let costCorr = cleanCost(i.avgCost, salesPrice)
      i.statistics.totalStock = qoh
      i.statistics.totalStockValue = costCorr * i.statistics.totalStock
      i.statistics.totalReorderpoint = Math.round(i.statistics.totalSold / 2)
      i.statistics.totalReorderpointValue =
        i.statistics.totalReorderpoint * costCorr
    }
    return i
  })
  return items
}
