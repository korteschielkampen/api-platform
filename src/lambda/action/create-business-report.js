import moment from 'moment'

import readDayreportFinancial from './read-financial-reports.js'
import readDayreportCategory from './read-category-reports.js'
import readDayreportArticle from './read-article-reports.js'
import createMessage from '../api/slack/create-message.js'

import dayReport from '../models/rapporten/day.js'

export default async () => {
  // Select today
  let datesArray = [
    {
      date: moment()
        // .subtract(2, 'days')
        .format(),
      lsRefresh: false,
    },
  ]

  // Read dayreports from Lightspeed
  let financialReports = await readDayreportFinancial(datesArray)
  let categoryReport = await readDayreportCategory(datesArray)
  let articleReport = await readDayreportArticle(datesArray)

  // Post to Slack
  await createMessage(
    dayReport(financialReports[0], categoryReport, articleReport)
  )
  return true
}
