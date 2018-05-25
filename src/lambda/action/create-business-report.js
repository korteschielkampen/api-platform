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

  if (sales.length != 0) {
    console.log('Generating Financial Report')
    let financialReport = await createFinancialReport(sales)

    console.log('Generating Category Report')
    let categoryReport = await createCategoryReport(sales)

    console.log('Generating Article Report')
    let articleReport = await createArticleReport(sales)

    console.log('Generating Day Report')
    return {
      date: date,
      financialReport: financialReport,
      categoryReport: categoryReport,
      articleReport: articleReport,
      sales: sales,
    }
  } else {
    return {
      date: date,
    }
  }
}

export default async (datesArray, channel) => {
  let dayReports = await pmap(datesArray, asyncify(businessReportData))

  console.log('Generating Barcharts')
  dayReports[0].charts = await createCharts(dayReports, channel)

  console.log('Posting Day Report to Slack')
  await createMessage(createDayReport(dayReports[0], channel))
}
