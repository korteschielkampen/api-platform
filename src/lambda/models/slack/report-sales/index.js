import _ from 'lodash'
import createFinancialReport from './financial'

export default (dayReport, channel) => {
  return {
    text: 'Uw dagelijkse rapport',
    channel: channel,
    username: 'Lightspeed - Dagrapporten',
    attachments: [...createFinancialReport(dayReport)],
  }
}
