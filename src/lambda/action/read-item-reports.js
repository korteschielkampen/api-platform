import moment from 'moment'
import { asyncify, map } from 'async'
import { promisify } from 'util'
const pmap = promisify(map)

import readDayreportItem from './read-financial-reports.js'

import readSalesDay from './read-salesday.js'
import readItems from '../api/lightspeed/read-items.js'

import updateDynamo from '../store/dynamo/salesday/update.js'
import readDynamo from '../store/dynamo/salesday/read.js'
import calculateDayreport from '../transformation/lightspeed-sales--to--dayreport.js'
import getItems from '../transformation/lightspeed-sales--to--sold-items.js'

export default async datesArray => {
  let itemreports = await pmap(datesArray, asyncify(readSalesDay))
  return itemreports
}
