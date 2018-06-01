import moment from 'moment'
import fs from 'fs'

import createSoldItems from './transformation/lightspeed-sales--to--sold-items.js'
import createFinancialReport from './transformation/lightspeed-sales--to--financial-report.js'
import createCategoryReport from './transformation/lightspeed-items--to--category-report.js'
import createWeightedCategoryReport from './transformation/lightspeed-items--to--weighted-category-report.js'
import createArticleReport from './transformation/lightspeed-items--to--article-report.js'
import createSpecialDayReports from './transformation/day-reports--to--day-reports-specials.js'

import createChartCategory from './action/create-chart-category.js'
import createChartIncome from './action/create-chart-income.js'

import createMessage from './api/slack/create-message.js'
import createDayReport from './models/rapporten/day.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }

  try {
    let sales = JSON.parse(fs.readFileSync('./src/data/sales.json'))
    let items = JSON.parse(fs.readFileSync('./src/data/items.json'))

    let soldItems = createSoldItems(sales)
    let financialReport = await createFinancialReport(sales)
    let categoryReport = await createCategoryReport(items, soldItems)
    let articleReport = await createArticleReport(items, soldItems)

    let dayReport = {
      date: {
        date: moment().format(),
        delay: 2000,
      },
      financialReport: financialReport,
      categoryReport: categoryReport,
      articleReport: articleReport,
      sales: sales,
      items: items,
    }

    let dayReports = createSpecialDayReports([dayReport])
    dayReports[0].charts = {}
    dayReports[0].charts.category = await createChartCategory(dayReports)
    dayReports[0].charts.financial = await createChartIncome(dayReports)

    let test = createWeightedCategoryReport(items, soldItems)

    // await createMessage(createDayReport(dayReports[0], 'CAPCPRW6B'))

    respond({ status: 200, body: { message: 'succes', body: articleReport } })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
