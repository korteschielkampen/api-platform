import _ from 'lodash'
import createFinancialReport from './financial'
import createCategoryReport from './category'
import createPurchaseReport from './purchase'
import createArticleReport from './article'
import createDataReport from './dataquality'

export default (pR, cR, aR) => {
  return {
    text: 'Uw dagelijkse rapport',
    channel: 'CAPCPRW6B',
    username: 'Lightspeed - Dagrapporten',
    icon_url:
      'https://integration-platform.korteschielkampen.nl/lightspeed.png',
    attachments: [
      ...createFinancialReport(pR, aR),
      ...createCategoryReport(cR),
      // {
      //   title: 'Inkooporders',
      //   color: '#ef3945',
      //   attachment_type: 'default',
      // },
      // createPurchaseReport(cR),
      ...createArticleReport(aR),
      // createDataReport(cR),
    ],
  }
}
