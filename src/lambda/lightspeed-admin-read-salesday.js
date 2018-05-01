import _ from 'lodash'
import moment from 'moment';

import readSalesDay from './api/lightspeed/read-sales-day.js'
import updateDynamo from './api/dynamo/update-sales.js'
import readDynamo from './api/dynamo/read-sales.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    });
  };

  try {
    // Read from Dynamo
    let date = moment(JSON.parse(event.body).date).startOf('day').format();
    let lsRequested = false;
    let salesDay = await readDynamo(date);

    //  When not in Dynamo download from Lightspeed and put in Dynamo
    if (!salesDay) {
      lsRequested = true;
      let sales = await readSalesDay(date);
      salesDay = await updateDynamo(sales, date);
    }

    // Calculate taxes
    let taxrates = {
      hoog: {name: "hoog", amount: 0},
      laag: {name: "laag", amount: 0},
      onbelast: {name: "onbelast", amount: 0}
    };

    let payments = {
      cash: {name: "cash", amount: 0},
      pin: {name: "pin", amount: 0},
      credit: {name: "credit", amount: 0},
      gift: {name: "gift", amount: 0},
    }

    _.map(salesDay.sales, (sale, saleID)=>{
      if (sale.completed == "true" && sale.SaleLines) {
        // Do the taxes
        _.map(sale.SaleLines.SaleLine, (line, lineID)=>{
          switch (line.taxClassID) {
            case "1":
              taxrates.hoog.amount += parseFloat(line.calcTotal);
              break;
            case "3":
              taxrates.laag.amount += parseFloat(line.calcTotal);
              break;
            case "6":
              taxrates.onbelast.amount += parseFloat(line.calcTotal);
              break;
            default:
          }
        })
      }

      // Do the payments
      if (sale.completed == "true" && sale.SalePayments) {
        _.map(sale.SalePayments.SalePayment, (line, lineID)=>{
          console.log(line)
          switch (line.paymentTypeID) {
            case "1":
              payments.cash.amount += parseFloat(line.amount);
              break;
            case "11":
              payments.pin.amount += parseFloat(line.amount);
              break;
            case "4":
              payments.credit.amount += parseFloat(line.amount);
              break;
            case "5":
              payments.gift.amount += parseFloat(line.amount);
              break;
            default:
          }
        })
      }
    });

    taxrates.hoog.amount = taxrates.hoog.amount.toFixed(2)
    taxrates.laag.amount = taxrates.laag.amount.toFixed(2)
    taxrates.onbelast.amount = taxrates.onbelast.amount.toFixed(2)

    payments.cash.amount = payments.cash.amount.toFixed(2)
    payments.pin.amount = payments.pin.amount.toFixed(2)
    payments.credit.amount = payments.credit.amount.toFixed(2)
    payments.gift.amount = payments.gift.amount.toFixed(2)

    respond({
      status: 200,
      body: {
        sales: {
          ...salesDay
        },
        taxrates: taxrates,
        payments: payments,
        lightspeed: lsRequested
      }
    });

  } catch(err) {
    console.log(err);
    respond({ status: 422, body: err });
  }

}
