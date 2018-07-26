import cleanSaleLines from '../../api/lightspeed/clean-saleslines.js'
import prognosedCost from '../item/prognosed-cost.js'

const calcStats = line => {
  // Seperation of actual numeric calculation, which is distinctive from
  // traversal of the datastructure. Guesscost is seperated again, because it is
  // quite problematic, can distort views quite bit.
  let totalCost = prognosedCost(
    line.avgCost,
    line.unitPrice / (1 + line.tax1Rate)
  )
  return {
    totalSold: line.unitQuantity,
    totalRevenue: line.calcTotal / (1 + line.tax1Rate),
    totalProfit: line.unitPrice / (1 + line.tax1Rate) - totalCost,
  }
}

export default sales => {
  // Traverse and reduce the datastructure (single reduce not posible due to
  // nesting of salelines in sale, which is necessairy for the the completed boolean)
  let itemsHashed = {}
  sales.forEach((sale, saleID) => {
    if (sale.completed == 'true' && sale.SaleLines) {
      sale = cleanSaleLines(sale)
      sale.SaleLines.SaleLine.forEach(line => {
        let statistics = calcStats(line)
        // Mutate the items
        itemsHashed[line.itemID] = itemsHashed[line.itemID]
          ? {
              itemID: line.itemID,
              statistics: {
                totalSold:
                  itemsHashed[line.itemID].statistics.totalSold +
                  statistics.totalSold,
                totalRevenue:
                  itemsHashed[line.itemID].statistics.totalRevenue +
                  statistics.totalRevenue,
                totalProfit:
                  itemsHashed[line.itemID].statistics.totalProfit +
                  statistics.totalProfit,
              },
            }
          : {
              itemID: line.itemID,
              statistics: statistics,
            }
      })
    }
  })

  // Pass an array of certain things, not a hashed structure of certain things
  // through the app. Implemented natively.
  return Object.values(itemsHashed)
}
