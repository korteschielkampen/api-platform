import moment from 'moment'

import readDayreportFinancial from './read-financial-reports.js'
import readDayreportItem from './read-item-reports.js'
import createMessage from '../api/slack/create-message.js'

import verkoopRapport from '../models/rapporten/verkoop.js'

export default async () => {
  // Select today
  let datesArray = [{ date: moment().format(), lsRefresh: false }]

  // Read dayreports from Lightspeed
  let financialReports = await readDayreportFinancial(datesArray)
  let itemsReports = await readDayreportItem(datesArray)
  // Post to Slack
  await createMessage(verkoopRapport(financialReports[0]))
  return true
}
