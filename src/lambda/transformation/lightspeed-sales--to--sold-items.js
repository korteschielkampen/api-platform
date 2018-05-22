import _ from 'lodash'

export default salesDay => {
  let items = []

  let count = 0
  _.map(salesDay.sales, (sale, saleID) => {
    count += parseFloat(sale.calcTotal)
    if (sale.completed == 'true' && sale.SaleLines) {
      let subcount = 0
      _.map(sale.SaleLines.SaleLine, (line, lineID) => {
        subcount += parseFloat(line.calcTotal)
        items.push({
          id: line.itemID,
          value: line.calcTotal,
          quantity: line.unitQuantity,
        })
      })
    }
  })

  return items
}
