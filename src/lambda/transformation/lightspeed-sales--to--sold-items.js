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
            quantity: line.unitQuantity,
          })
        })
      } else {
        let line = sale.SaleLines.SaleLine
        items.push({
          id: line.itemID,
          value: parseFloat(line.calcTotal) / (1 + parseFloat(line.tax1Rate)),
          quantity: line.unitQuantity,
        })
      }
    }
  })
  return items
}
