import _ from 'lodash'
import util from 'util'
import guessCost from '../item/clean-cost.js'

const statistics = () => {
  return {
    totalSold: 0,
    totalRevenue: 0,
    totalProfit: 0,
  }
}

const cleanSaleLines = sale => {
  // Sometimes object, sometimes array. Now always array.
  if (!Array.isArray(sale.SaleLines.SaleLine)) {
    sale.SaleLines.SaleLine = [sale.SaleLines.SaleLine]
  }

  // Parse saleLine values
  _.map(sale.SaleLines.SaleLine, (line, lineID) => {
    line.unitQuantity = parseFloat(line.unitQuantity)
    line.unitPrice = parseFloat(line.unitPrice)
    line.calcTotal = parseFloat(line.calcTotal)
    line.tax1Rate = parseFloat(line.tax1Rate)
    line.avgCost = parseFloat(line.avgCost)
  })

  return sale
}

export default sales => {
  let lines = []
  let itemsHashed = {}
  _.forEach(sales, (sale, saleID) => {
    if (sale.completed == 'true' && sale.SaleLines) {
      sale = cleanSaleLines(sale)
      _.map(sale.SaleLines.SaleLine, line => {
        let totalRevenue = line.calcTotal / (1 + line.tax1Rate)
        let totalSold = line.unitQuantity
        let totalCost = guessCost(
          line.avgCost,
          line.unitPrice / (1 + line.tax1Rate)
        )
        let totalProfit = line.unitPrice / (1 + line.tax1Rate) - totalCost

        if (!itemsHashed[line.itemID]) {
          itemsHashed[line.itemID] = {
            itemID: line.itemID,
            statistics: statistics(),
          }
        }

        itemsHashed[line.itemID] = {
          itemID: line.itemID,
          statistics: {
            totalSold:
              itemsHashed[line.itemID].statistics.totalSold + totalSold,
            totalRevenue:
              itemsHashed[line.itemID].statistics.totalRevenue + totalRevenue,
            totalProfit:
              itemsHashed[line.itemID].statistics.totalProfit + totalProfit,
          },
        }
      })
    }
  })
  return itemsHashed
}
