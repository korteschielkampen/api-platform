import _ from 'lodash'

export default salesDay => {
  let items = []

  _.map(salesDay.sales, (sale, saleID) => {
    // Do the taxes
    if (sale.completed == 'true' && sale.SaleLines) {
      _.map(sale.SaleLines.SaleLine, (line, lineID) => {
        items.push({ id: line.itemID, value: line.calcTotal })
      })
    }
  })

  return items
}
