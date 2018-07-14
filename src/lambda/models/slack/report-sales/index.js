import _ from 'lodash'
import createFinancialReport from './financial'
import createCategoryReport from './category'

export default (dayReport, channel) => {
  return {
    text: 'Uw dagelijkse rapport',
    channel: channel,
    username: 'Lightspeed - Dagrapporten',
    icon_url:
      'https://integration-platform.korteschielkampen.nl/lightspeed.png',
    attachments: [
      ...createFinancialReport(dayReport),
      ...createCategoryReport(dayReport),
    ],
  }
}
