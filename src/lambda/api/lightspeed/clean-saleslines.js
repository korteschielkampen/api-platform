export default sale => {
  // Sometimes object, sometimes array. Now always array.
  if (!Array.isArray(sale.SaleLines.SaleLine)) {
    sale.SaleLines.SaleLine = [sale.SaleLines.SaleLine]
  }

  // Parse saleLine values. It might actually be best to do this earlyer on
  // when the data is pulled from lightspeed. Do this for every fucking values
  // in the thing you will use.
  _.map(sale.SaleLines.SaleLine, (line, lineID) => {
    line.unitQuantity = parseFloat(line.unitQuantity)
    line.unitPrice = parseFloat(line.unitPrice)
    line.calcTotal = parseFloat(line.calcTotal)
    line.tax1Rate = parseFloat(line.tax1Rate)
    line.avgCost = parseFloat(line.avgCost)
  })

  return sale
}
