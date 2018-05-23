import _ from 'lodash'

export default salesDay => {
  let tax = {
    hoog: { name: 'hoog', amount: 0 },
    laag: { name: 'laag', amount: 0 },
    onbelast: { name: 'onbelast', amount: 0 },
  }

  let payments = {
    cash: { name: 'cash', amount: 0 },
    pin: { name: 'pin', amount: 0 },
    credit: { name: 'credit', amount: 0 },
    gift: { name: 'gift', amount: 0 },
  }

  let analysis = {
    total: 0,
    profit: 0,
    sales: 0,
    unreliabilityCount: 0,
    unreliabilityTotal: 0,
  }

  if (salesDay.sales.length > 0) {
    _.map(salesDay.sales, (sale, saleID) => {
      // Do the taxes
      if (sale.completed == 'true' && sale.SaleLines) {
        _.map(sale.SaleLines.SaleLine, (line, lineID) => {
          switch (line.taxClassID) {
            case '1':
              tax.hoog.amount += parseFloat(line.calcTotal)
              break
            case '3':
              tax.laag.amount += parseFloat(line.calcTotal)
              break
            case '6':
              tax.onbelast.amount += parseFloat(line.calcTotal)
              break
            default:
          }
        })
      }

      // Do the payments
      if (sale.completed == 'true' && sale.SalePayments) {
        _.map(sale.SalePayments.SalePayment, (line, lineID) => {
          if (line.archived != 'true') {
            switch (line.paymentTypeID) {
              case '1':
                payments.cash.amount += parseFloat(line.amount)
                break
              case '11':
                payments.pin.amount += parseFloat(line.amount)
                break
              case '4':
                payments.credit.amount += parseFloat(line.amount)
                break
              case '5':
                payments.gift.amount += parseFloat(line.amount)
                break
              default:
            }
          }
        })
      }

      // Do the analysis
      if (sale.completed == 'true' && sale.SaleLines) {
        analysis.total += parseFloat(sale.calcTotal)
        analysis.sales++
        if (sale.calcAvgCost == '0') {
          analysis.unreliabilityCount++
          analysis.unreliabilityTotal += parseFloat(sale.calcTotal)
          analysis.profit += parseFloat(sale.calcTotal) * 0.3
        } else {
          analysis.profit +=
            parseFloat(sale.calcTotal) - parseFloat(sale.calcAvgCost)
        }
      }
    })
  }

  analysis.saleSize = analysis.total / analysis.sales

  tax.hoog.amount = tax.hoog.amount.toFixed(2)
  tax.laag.amount = tax.laag.amount.toFixed(2)
  tax.onbelast.amount = tax.onbelast.amount.toFixed(2)

  payments.cash.amount = payments.cash.amount.toFixed(2)
  payments.pin.amount = payments.pin.amount.toFixed(2)
  payments.credit.amount = payments.credit.amount.toFixed(2)
  payments.gift.amount = payments.gift.amount.toFixed(2)

  return {
    tax: tax,
    payments: payments,
    analysis: analysis,
  }
}
