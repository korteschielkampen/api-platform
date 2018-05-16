import moment from 'moment'
import _ from 'lodash'
import { asyncify, map } from 'async'
import { promisify } from 'util'
const pmap = promisify(map)

import readSalesDay from './read-salesday.js'
import updateDynamo from '../store/dynamo/salesday/update.js'
import readDynamo from '../store/dynamo/salesday/read.js'
import calculateDayreport from '../transformation/lightspeed-sales--to--dayreport.js'

export default async datesArray => {
  let salesDay = await pmap(datesArray, asyncify(readSalesDay))

  let dayreports = _.map(salesDay, (salesDay, key) => {
    return {
      ...salesDay,
      ...calculateDayreport(salesDay),
    }
  })

  return dayreports
}
