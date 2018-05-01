import _ from 'lodash'

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
    let date = JSON.parse(event.body).date;
    let lsRequested = false;
    let salesDay = await readDynamo(date);

    //  When not in Dynamo download from Lightspeed and put in Dynamo
    if (!salesDay) {
      lsRequested = true;
      let sales = await readSalesDay(date);
      salesDay = await updateDynamo(sales, date);
    }

    // Calculate taxes
    // let taxrates = {"hoog": 0, "laag": 0, "onbelast": 0};
    // _.map(salesDay.sales, (sale, saleID)=>{
    //   if (sale.SaleLines) {
    //     // Account for API inconsistency: Returns single value as object
    //     if (!(sale.SaleLines.SaleLine.constructor === Array)) {
    //       sale.SaleLines.SaleLine = [sale.SaleLines.SaleLine];
    //     }
    //     // Do the accounting
    //     _.map(sale.SaleLines.SaleLine, (line, lineID)=>{
    //       switch (line.taxClassID) {
    //         case "1":
    //           taxrates.hoog += parseFloat(line.calcTotal);
    //           break;
    //         case "3":
    //           taxrates.laag += parseFloat(line.calcTotal);
    //           break;
    //         case "6":
    //           taxrates.onbelast += parseFloat(line.calcTotal);
    //           break;
    //         default:
    //       }
    //     })
    //   }
    // });

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
