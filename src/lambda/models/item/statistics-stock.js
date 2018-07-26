// Set additional statistics for stock
import cleanCost from './guess-cost.js'

const reorderOptions = {
  tight: n => n / 6, // 1 maand
  normal: n => n / 2, // 3 maand
  long: n => n, // 6 maand
  specialistic: n => 1, // 1 constant
  exit: n => 0, // 0 constant
  remarkable: n => undefined, // handmatig
}

const calculateReorderpoint = (i, status) => {
  let reorderpoint

  // Calculate flags
  if (reorderOptions[status]) {
    reorderpoint = Math.round(reorderOptions[status](i.statistics.totalSold))
  } else {
    reorderpoint = reorderOptions.normal(i.statistics.totalSold)
  }

  return reorderpoint
}

const calculateDuration = i => {
  let sellingSpeedInWeeks = i.statistics.totalSold / 26
  let duration = Math.floor(i.statistics.totalStock / sellingSpeedInWeeks)
  return duration
}

export default items => {
  items = items.map(i => {
    if (i.ItemShops) {
      let qoh = parseInt(
        i.ItemShops.ItemShop.find(i => i.shopID == '1' && i).qoh
      )
      let salesPrice = parseInt(
        i.Prices.ItemPrice.find(i => i.useType == 'Default' && i).amount
      )
      let costCorr = cleanCost(i.avgCost, salesPrice)
      i.statistics.totalStock = qoh
      i.statistics.totalStockValue = costCorr * i.statistics.totalStock
      i.statistics.totalReorderpoint = calculateReorderpoint(i, 'normal')
      i.statistics.totalReorderpointValue =
        i.statistics.totalReorderpoint * costCorr
      i.statistics.totalDuration = calculateDuration(i, 'normal')
    }
    return i
  })
  return items
}
