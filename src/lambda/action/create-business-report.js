import _ from 'lodash'
import { asyncify, map } from 'async'
import { promisify } from 'util'
const pmap = promisify(map)

import readSalesDay from './read-salesday.js'
import createFinancialReport from './create-financial-reports.js'
import createCategoryReport from './create-category-reports.js'
import createArticleReport from './create-article-reports.js'
import createCharts from './create-charts.js'
import createDayReport from '../models/rapporten/day.js'
import createMessage from '../api/slack/create-message.js'

const businessReportData = async (date, channel) => {
  console.log('Retrieving Sales')
  let sales = await readSalesDay(date)

  console.log('Generating Financial Report')
  let financialReport = await createFinancialReport(sales)

  console.log('Generating Category Report')
  let categoryReport = await createCategoryReport(sales)

  console.log('Generating Article Report')
  let articleReport = await createArticleReport(sales)

  console.log('Generating Day Report')
  return (dayReport = {
    date: datesArray[0],
    financialReport: financialReport,
    categoryReport: categoryReport,
    articleReport: articleReport,
    sales: sales,
  })
}

export default async (datesArray, channel) => {
  let dayReport = await businessReportData(datesArray[0])

  console.log('Retrieving Older Day Reports')
  let dayReports = [
    dayReport,
    dayReport,
    dayReport,
    dayReport,
    dayReport,
    dayReport,
    dayReport,
    dayReport,
    dayReport,
    dayReport,
    dayReport,
    dayReport,
    dayReport,
    dayReport,
  ]

  console.log('Generating Barcharts')
  dayReport.charts = await createCharts(dayReports, channel)

  console.log('Posting Day Report to Slack')
  await createMessage(createDayReport(dayReport, channel))
}
