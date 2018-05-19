import moment from 'moment'

import readDayreportFinancial from './read-financial-reports.js'
import readDayreportCategory from './read-category-reports.js'
import createMessage from '../api/slack/create-message.js'

import verkoopRapport from '../models/rapporten/verkoop.js'

export default async () => {
  // Select today
  let datesArray = [{ date: moment().format(), lsRefresh: false }]

  // Read dayreports from Lightspeed
  let financialReports = await readDayreportFinancial(datesArray)
  let categoryReport = await readDayreportCategory(datesArray)

  // Post to Slack
  await createMessage(verkoopRapport(financialReports[0], categoryReport))
  return true
}
