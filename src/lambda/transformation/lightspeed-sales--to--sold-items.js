import _ from 'lodash'

export default salesDay => {
  let items = []

  let zeroCount = 0
  _.map(salesDay.sales, (sale, saleID) => {
    // Do the taxes
    if (sale.completed == 'true' && sale.SaleLines) {
      _.map(sale.SaleLines.SaleLine, (line, lineID) => {
        // console.log(line)
        if (line.itemID != 0) {
          items.push(line.itemID)
        } else {
          zeroCount++
        }
      })
    }
  })

  console.log('Zerocount', zeroCount)
  return items
}
