import _ from 'lodash'

import updateDynamo from '../config/update.js'

export default async (sales, date) => {
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
