import _ from 'lodash'
import util from 'util'
import guessCost from '../item/guess-cost.js'

export default sales => {
  let lines = []
  _.map(sales, (sale, saleID) => {
    if (sale.completed == 'true' && sale.SaleLines) {
      // Sometimes object, sometimes array. Now always array.
      if (!Array.isArray(sale.SaleLines.SaleLine)) {
        sale.SaleLines.SaleLine = [sale.SaleLines.SaleLine]
      }
      _.map(sale.SaleLines.SaleLine, (line, lineID) => {
        lines.push({
          itemID: line.itemID,
          totalSold: parseFloat(line.unitQuantity),
          revenue: parseFloat(line.calcTotal) / (1 + parseFloat(line.tax1Rate)),
          profit:
            parseFloat(line.unitPrice) / (1 + parseFloat(line.tax1Rate)) -
            guessCost(
              parseFloat(line.avgCost),
              parseFloat(line.unitPrice) / (1 + parseFloat(line.tax1Rate))
            ),
        })
      })
    }
  })

  let itemsHashed = {}
  lines.forEach(l => {
    if (itemsHashed[l.itemID]) {
      itemsHashed[l.itemID] = {
        itemID: l.itemID,
        statistics: {
          totalSold: itemsHashed[l.itemID].statistics.totalSold + l.totalSold,
          totalRevenue:
            itemsHashed[l.itemID].statistics.totalRevenue + l.revenue,
          totalProfit: itemsHashed[l.itemID].statistics.totalProfit + l.profit,
        },
      }
    } else {
      itemsHashed[l.itemID] = {
        itemID: l.itemID,
        statistics: {
          totalSold: l.totalSold,
          totalRevenue: l.revenue,
          totalProfit: l.profit,
        },
      }
    }
  })

  return itemsHashed
}
