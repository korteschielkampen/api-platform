import _ from 'lodash'

import updateDynamo from '../config/update.js'

export default async (sales, date) => {
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

      // Normalize salelines and salespayments to array
      if (sale.SaleLines && !(sale.SaleLines.SaleLine.constructor === Array)) {
        sale.SaleLines.SaleLine = [sale.SaleLines.SaleLine]
      }
      if (
        sale.SalePayments &&
        !(sale.SalePayments.SalePayment.constructor === Array)
      ) {
        sale.SalePayments.SalePayment = [sale.SalePayments.SalePayment]
      }

      // Normalize payment empty keys for dynamo
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

  let salesDay = {
    TableName: 'lightspeed-sales-day',
    Item: {
      timeStamp: date,
      sales: cleanSales,
    },
  }

  await updateDynamo(salesDay)
  return salesDay.Item
}
