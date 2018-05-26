import moment from 'moment'

import readSalesDay from '../api/lightspeed/read-salesday.js'
import updateDynamo from '../store/dynamo/salesday/update.js'
import readDynamo from '../store/dynamo/salesday/read.js'

export default async (dateObject, key) => {
  // Setup variables
  let date = moment(dateObject.date)
    .startOf('day')
    .format()
  let lsRequested = false

  let sales = await readSalesDay(date)

  // Read from Dynamo
  // if (!dateObject.lsRefresh) {
  //   salesDay = await readDynamo(date)
  // }

  // When not in Dynamo download from Lightspeed and put in Dynamo
  // if (!salesDay || dateObject.lsRefresh) {
  //   lsRequested = true
  //   sales = await readSalesDay(date)
  // salesDay = await updateDynamo(sales, date)
  // }

  return sales
}
