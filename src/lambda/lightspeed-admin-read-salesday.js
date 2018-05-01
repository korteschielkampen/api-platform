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
    _.map(salesDay.sales, (sale, saleID)=>{
      console.log(sale.completed, sale.calcTotal)
      if (sale.completed == "true" && sale.SaleLines) {
        // Account for API inconsistency: Returns single value as object
        if (!(sale.SaleLines.SaleLine.constructor === Array)) {
          sale.SaleLines.SaleLine = [sale.SaleLines.SaleLine];
        }
        // Do the accounting
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
    });

    taxrates.hoog.amount = taxrates.hoog.amount.toFixed(2)
    taxrates.laag.amount = taxrates.laag.amount.toFixed(2)
    taxrates.onbelast.amount = taxrates.onbelast.amount.toFixed(2)

    respond({
      status: 200,
      body: {
        sales: {
          ...salesDay
        },
        taxrates: taxrates,
        lightspeed: lsRequested
      }
    });

  } catch(err) {
    console.log(err);
    respond({ status: 422, body: err });
  }

}
