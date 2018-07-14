import _ from 'lodash'
import { asyncify, map } from 'async'
import { promisify } from 'util'
const pmap = promisify(map)
const delay = require('delay')

import readSalesDay from '../api/lightspeed/read-sales.js'
import readItems from '../api/lightspeed/read-items.js'

import createSoldItems from '../models/sales/sold-items.js'
import createFinancialReport from '../models/financial/tax-and-payments.js'
import createSpecialDayReports from '../models/financial/specials.js'

import createChartIncome from './create-chart-income.js'

import createMessage from '../api/slack/create-message.js'
import createDayReport from '../models/slack/report-sales/'

const businessReportData = async (date, key) => {
  await delay(date.delay)
  console.log('Starting: ', date.date)

  let sales = await readSalesDay(date.date, date.date)

  let completedSales = 0
  if (sales) {
    sales.map(sale => {
      if (sale.completed == 'true') {
        completedSales++
      }
    })
  }

  if (sales && completedSales > 0) {
    let soldItems = createSoldItems(sales)

    if (soldItems.length > 0) {
      console.log('Calculating: ', date.date)

      let items = await readItems(soldItems)
      let financialReport = await createFinancialReport(sales)

      console.log('Finished: ', date.date)

      return {
        date: date,
        financialReport: financialReport,
        sales: sales,
        items: items,
      }
    } else {
      return {
        date: date,
      }
    }
  } else {
    return {
      date: date,
    }
  }
}

export default async (datesArray, postSlack) => {
  let dayReports = await pmap(datesArray, asyncify(businessReportData))

  dayReports = dayReports.reverse()

  if (dayReports[dayReports.length - 1].sales) {
    console.log('Calculating Specials')
    dayReports = createSpecialDayReports(dayReports)

    console.log('Generating Charts')
    dayReports[dayReports.length - 1].charts = {}
    dayReports[
      dayReports.length - 1
    ].charts.financial = await createChartIncome(dayReports)

    if (postSlack.post) {
      console.log('Posting Day Report to Slack')
      await createMessage(
        createDayReport(dayReports[dayReports.length - 1], postSlack.channel)
      )
    }

    return dayReports
  }
}
