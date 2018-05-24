import readDayreportFinancial from './read-financial-reports.js'
import readDayreportCategory from './read-category-reports.js'
import readDayreportArticle from './read-article-reports.js'
import generateBarChart from '../api/slack/create-file.js'
import createMessage from '../api/slack/create-message.js'

import dayReport from '../models/rapporten/day.js'

export default async (datesArray, channel) => {
  // Read dayreports from Lightspeed
  console.log('Generating Financial Report')
  let financialReports = await readDayreportFinancial(datesArray)

  console.log('Generating Category Report')
  let categoryReport = await readDayreportCategory(datesArray)

  console.log('Generating Article Report')
  let articleReport = await readDayreportArticle(datesArray)

  console.log('Generating Barchart')
  let barchart = await generateBarChart('none', channel)

  console.log(barchart)

  // Post to Slack
  await createMessage(
    dayReport(financialReports[0], categoryReport, articleReport, channel)
  )
  return true
}
