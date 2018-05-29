import _ from 'lodash'

export default sales => {
  let items = []
  let count = 0
  _.map(sales, (sale, saleID) => {
    count += parseFloat(sale.calcTotal)
    if (sale.completed == 'true' && sale.SaleLines) {
      let subcount = 0
      if (Array.isArray(sale.SaleLines.SaleLine)) {
        _.map(sale.SaleLines.SaleLine, (line, lineID) => {
          subcount += parseFloat(line.calcTotal)
          items.push({
            id: line.itemID,
            value: parseFloat(line.calcTotal) / (1 + parseFloat(line.tax1Rate)),
            quantity: line.unitQuantity,
          })
        })
      } else {
        let line = sale.SaleLines.SaleLine
        subcount += parseFloat(line.calcTotal)
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
