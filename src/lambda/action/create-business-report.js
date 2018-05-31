import _ from 'lodash'
import { asyncify, map } from 'async'
import { promisify } from 'util'
const pmap = promisify(map)
const delay = require('delay')

import readSalesDay from '../api/lightspeed/read-sales.js'
import readItems from '../api/lightspeed/read-items.js'

import createSoldItems from '../transformation/lightspeed-sales--to--sold-items.js'
import createFinancialReport from '../transformation/lightspeed-sales--to--financial-report.js'
import createCategoryReport from '../transformation/lightspeed-items--to--category-report.js'
import createArticleReport from '../transformation/lightspeed-items--to--article-report.js'
import createSpecialDayReports from '../transformation/day-reports--to--day-reports-specials.js'

import createChartCategory from './create-chart-category.js'
import createChartIncome from './create-chart-income.js'

import createMessage from '../api/slack/create-message.js'
import createDayReport from '../models/rapporten/day.js'

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

  // console.log(sales)

  if (sales && completedSales > 0) {
    let soldItems = createSoldItems(sales)

    if (soldItems.length > 0) {
      console.log('Calculating: ', date.date)

      let items = await readItems(soldItems)
      let financialReport = await createFinancialReport(sales)
      let categoryReport = await createCategoryReport(items, soldItems)
      let articleReport = await createArticleReport(items, soldItems)

      console.log('Finished: ', date.date)

      return {
        date: date,
        financialReport: financialReport,
        categoryReport: categoryReport,
        articleReport: articleReport,
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
    ].charts.category = await createChartCategory(dayReports, postSlack.channel)
    dayReports[
      dayReports.length - 1
    ].charts.financial = await createChartIncome(dayReports, postSlack.channel)

    if (postSlack.post) {
      console.log('Posting Day Report to Slack')
      await createMessage(
        createDayReport(dayReports[dayReports.length - 1], postSlack.channel)
      )
    }

    return dayReports
  }
}
