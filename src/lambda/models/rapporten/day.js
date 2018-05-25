import _ from 'lodash'
import createFinancialReport from './financial'
import createCategoryReport from './category'
import createPurchaseReport from './purchase'
import createArticleReport from './article'
import createDataReport from './dataquality'

export default (dayReport, channel) => {
  return {
    text: 'Uw dagelijkse rapport',
    // channel: 'CAPCPRW6B', // Test
    channel: channel, // Kassa
    username: 'Lightspeed - Dagrapporten',
    icon_url:
      'https://integration-platform.korteschielkampen.nl/lightspeed.png',
    attachments: [
      ...createFinancialReport(dayReport),
      ...createCategoryReport(dayReport),
      // {
      //   title: 'Inkooporders',
      //   color: '#ef3945',
      //   attachment_type: 'default',
      // },
      // createPurchaseReport(cR),
      ...createArticleReport(dayReport),
      // createDataReport(cR),
    ],
  }
}
