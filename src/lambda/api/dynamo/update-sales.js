import updateDynamo from '../../general/dynamo/update.js'
const util = require('util')

export default async (sales, date) => {
  // Normalize object/array output and the empty strings for Dynamo
  _.each(sales, (sale)=>{
    // Normalize sale empties
    _.each(sale, (saleValue, saleKey)=>{
      if (saleValue === "" || saleValue === null) {
        delete sale[saleKey];
      }
    })

    // Normalize salelines and salespayments to array
    if (sale.SaleLines && !(sale.SaleLines.SaleLine.constructor === Array)) {
      sale.SaleLines.SaleLine = [sale.SaleLines.SaleLine];
    }
    if (sale.SalePayments && !(sale.SalePayments.SalePayment.constructor === Array)) {
      sale.SalePayments.SalePayment = [sale.SalePayments.SalePayment];
    }

    // Normalize payment empties
    sale.SalePayments && _.each(sale.SalePayments.SalePayment, (payment)=>{
      _.each(payment, (paymentValue, paymentKey)=>{
        if (paymentValue === "" || paymentValue === null) {
          delete payment[paymentKey];
        }
      })
    })
  })

  let salesDay = {
    TableName: 'lightspeed-sales-day',
    Item: {
      timeStamp: date,
      sales: sales
    }
  };

  await updateDynamo(salesDay);
  return salesDay.Item;
}
