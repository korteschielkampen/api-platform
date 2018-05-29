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
import createChartCategory from './create-chart-category.js'
import createChartLine from './create-chart-line.js'
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

export default async (datesArray, postSlack) => {
  let dayReports = await pmap(datesArray, asyncify(businessReportData))

  dayReports = dayReports.reverse()

  if (dayReports[dayReports.length - 1].sales) {
    // Moneybird values for cost and special income
    console.log('Calculating profit')
    let rentIncome = 55
    let indirectCost = 186
    let specialCost = 22
    let dailyTotalCost = indirectCost + specialCost

    let totalProfit = 0
    let totalProfitPlusRent = 0
    let totalCost = 0
    let totalCostPlusLoans = 0
    let totalRevenue = 0
    dayReports = dayReports.map(report => {
      totalCost += indirectCost
      totalCostPlusLoans += dailyTotalCost
      if (report.sales) {
        // Totals
        totalProfit += report.financialReport.analysis.profit
        totalProfitPlusRent +=
          report.financialReport.analysis.profit + rentIncome
        totalRevenue += report.financialReport.analysis.taxlessTotal

        // Daily extra's
        report.financialReport.analysis.profitRent =
          report.financialReport.analysis.profit + rentIncome
        report.financialReport.analysis.dailyTotalCost = dailyTotalCost
        report.financialReport.analysis.indirectCost = indirectCost
        return {
          ...report,
          special: {
            rentIncome: rentIncome,
            indirectCost: indirectCost,
            dailyTotalCost: dailyTotalCost,
          },
        }
      } else {
        return {
          ...report,
          special: {
            rentIncome: rentIncome,
            indirectCost: indirectCost,
            dailyTotalCost: dailyTotalCost,
          },
        }
      }
    })

    dayReports[dayReports.length - 1].financialReport.analysis = {
      ...dayReports[dayReports.length - 1].financialReport.analysis,
      totalProfit: totalProfit,
      totalProfitPlusRent: totalProfitPlusRent,
      totalCost: totalCost,
      totalCostPlusLoans: totalCostPlusLoans,
      totalRevenue: totalRevenue,
    }

    console.log('Generating Charts')
    dayReports[dayReports.length - 1].charts = {}
    dayReports[
      dayReports.length - 1
    ].charts.category = await createChartCategory(dayReports, postSlack.channel)
    dayReports[dayReports.length - 1].charts.financial = await createChartLine(
      dayReports,
      postSlack.channel
    )

    if (postSlack.post) {
      console.log('Posting Day Report to Slack')
      await createMessage(
        createDayReport(dayReports[dayReports.length - 1], postSlack.channel)
      )
    }

    return dayReports
  }
}
