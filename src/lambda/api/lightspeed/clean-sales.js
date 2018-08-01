import _ from 'lodash'

export default sales => {
  // Normalize object/array output and the empty strings for Dynamo
  let cleanSales = _.filter(sales, sale => {
    // Normalize sale empty keys for dynamo
    if (sale === undefined) {
      return false
    }
    if (sale) {
      _.each(sale, (saleValue, saleKey) => {
        if (saleValue === '' || saleValue === null) {
          delete sale[saleKey]
        }
      })

      // Normalize and parse salelines and salespayments to array
      if (sale.SaleLines) {
        if (!(sale.SaleLines.SaleLine.constructor === Array)) {
          sale.SaleLines.SaleLine = [sale.SaleLines.SaleLine]
        }
        sale.SaleLines.SaleLine.map((line, lineID) => {
          line.unitQuantity = parseFloat(line.unitQuantity)
          line.unitPrice = parseFloat(line.unitPrice)
          line.calcTotal = parseFloat(line.calcTotal)
          line.tax1Rate = parseFloat(line.tax1Rate)
          line.avgCost = parseFloat(line.avgCost)
        })
      }

      // Normalize and parse payment empty keys for dynamo
      if (
        sale.SalePayments &&
        !(sale.SalePayments.SalePayment.constructor === Array)
      ) {
        sale.SalePayments.SalePayment = [sale.SalePayments.SalePayment]
      }
      sale.SalePayments &&
        _.each(sale.SalePayments.SalePayment, payment => {
          _.each(payment, (paymentValue, paymentKey) => {
            if (paymentValue === '' || paymentValue === null) {
              delete payment[paymentKey]
            }
          })
        })
    }
    return sale
  })
  return cleanSales
}
