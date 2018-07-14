import _ from 'lodash'

export default sales => {
  let items = []
  _.map(sales, (sale, saleID) => {
    if (sale.completed == 'true' && sale.SaleLines) {
      if (Array.isArray(sale.SaleLines.SaleLine)) {
        _.map(sale.SaleLines.SaleLine, (line, lineID) => {
          items.push({
            id: line.itemID,
            value: parseFloat(line.calcTotal) / (1 + parseFloat(line.tax1Rate)),
            valueWithTax: parseFloat(line.calcTotal),
            quantity: parseFloat(line.unitQuantity),
          })
        })
      } else {
        let line = sale.SaleLines.SaleLine
        items.push({
          id: line.itemID,
          value: parseFloat(line.calcTotal) / (1 + parseFloat(line.tax1Rate)),
          valueWithTax: parseFloat(line.calcTotal),
          quantity: parseFloat(line.unitQuantity),
        })
      }
    }
  })

  let itemsHashed = {}
  items.forEach(i => {
    if (itemsHashed[i.id]) {
      itemsHashed[i.id] = {
        itemID: i.id,
        statistics: {
          totalSold: itemsHashed[i.id].statistics.totalSold + i.quantity,
          totalRevenue: itemsHashed[i.id].statistics.totalRevenue + i.value,
          valueWithTax:
            itemsHashed[i.id].statistics.valueWithTax + i.valueWithTax,
        },
      }
    } else {
      itemsHashed[i.id] = {
        itemID: i.id,
        statistics: {
          totalSold: i.quantity,
          totalRevenue: i.value,
          valueWithTax: i.valueWithTax,
        },
      }
    }
  })
  return itemsHashed
}
