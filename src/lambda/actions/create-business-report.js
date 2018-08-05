import _ from 'lodash'
import util from 'util'
import { asyncify, mapLimit } from 'async'
import { promisify } from 'util'
const pmapLimit = promisify(mapLimit)
import moment from 'moment'

import readSales from '../api/lightspeed/read-sales.js'

import createFinancialReport from '../models/financial/tax-and-payments.js'
import createSpecialDayReports from '../models/financial/specials.js'

import createChartIncome from './create-chart-income.js'

import createMessage from '../api/slack/create-message.js'
import createDayReport from '../models/slack/report-sales/'

export default async (dates, postSlack) => {
  let sales = await readSales({ timeStamp: dates })

  let days = _.times(
    Math.ceil(moment.duration(moment(dates.end).diff(dates.start)).as('days')),
    i => {
      let date = moment(dates.end)
        .subtract(i, 'days')
        .format()
      return {
        date: date,
        sales: _.filter(sales, sale => {
          return moment(date).isSame(moment(sale.completeTime), 'day')
        }),
      }
    }
  )

  let dayReports = await _.map(
    days,
    // The function that is being mapped over
    ({ date, sales }) => {
      let completedSales = 0
      if (sales) {
        sales.map(sale => {
          if (sale.completed == 'true') {
            completedSales++
          }
        })
      }

      if (sales && completedSales > 0) {
        let financialReport = createFinancialReport(sales)
        return {
          date: date,
          sales: sales,
          financialReport: financialReport,
        }
      } else {
        return {
          date: date,
        }
      }
    }
  )
  dayReports = dayReports.reverse()

  if (dayReports[dayReports.length - 1].financialReport) {
    dayReports = createSpecialDayReports(dayReports)
    dayReports[dayReports.length - 1].charts = {
      financial: await createChartIncome(dayReports),
    }

    if (postSlack.post) {
      console.log('Posting Day Report to Slack')
      await createMessage(
        createDayReport(dayReports[dayReports.length - 1], postSlack.channel)
      )
    }

    return dayReports
  }
}
