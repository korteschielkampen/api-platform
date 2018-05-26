import _ from 'lodash'
import { asyncify, map } from 'async'
import { promisify } from 'util'
const pmap = promisify(map)
const delay = require('delay')

import readSalesDay from './read-salesday.js'
import createFinancialReport from './create-financial-reports.js'
import calculateSoldItems from '../transformation/lightspeed-sales--to--sold-items.js'
import readItems from '../api/lightspeed/read-items.js'
import createCategoryReport from './create-category-reports.js'
import createArticleReport from './create-article-reports.js'
import createCharts from './create-charts.js'
import createDayReport from '../models/rapporten/day.js'
import createMessage from '../api/slack/create-message.js'

const businessReportData = async (date, key) => {
  await delay(date.delay)

  console.log('Starting: ', date.date)

  let sales = await readSalesDay(date)

  let completedSales = 0
  if (sales) {
    sales.map(sale => {
      if (sale.completed == 'true') {
        completedSales++
      }
    })
  }

  if (sales && completedSales > 0) {
    let soldItems = calculateSoldItems(sales)

    if (soldItems.length > 0) {
      console.log('Calculating: ', date.date)

      let items = await readItems(soldItems)
      let financialReport = await createFinancialReport(sales)
      let categoryReport = await createCategoryReport(sales, items, soldItems)
      let articleReport = await createArticleReport(sales, items, soldItems)

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

export default async (datesArray, channel) => {
  let dayReports = await pmap(datesArray, asyncify(businessReportData))

  if (dayReports[0].sales) {
    console.log('Generating Barcharts')
    dayReports[0].charts = await createCharts(dayReports, channel)

    console.log('Posting Day Report to Slack')
    await createMessage(createDayReport(dayReports[0], channel))
  }
}
