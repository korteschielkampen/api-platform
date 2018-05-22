import _ from 'lodash'
import createPaymentReport from './payments'
import createCategoryReport from './category'
import createPurchaseReport from './purchase'
import createStockReport from './stock'
import createArticleReport from './article'
import createDataReport from './dataquality'

export default (dayreport, cR, aR) => {
  const totalEarnings = parseFloat(
    parseFloat(dayreport.payments.cash.amount) +
      parseFloat(dayreport.payments.pin.amount) +
      parseFloat(dayreport.payments.gift.amount) +
      parseFloat(dayreport.payments.credit.amount)
  ).toFixed(0)

  return {
    text: 'Uw dagelijkse rapport:',
    channel: 'CAPCPRW6B',
    username: 'Lightspeed - Dagrapporten',
    icon_url:
      'https://integration-platform.korteschielkampen.nl/lightspeed.png',
    attachments: [
      {
        title: `Financieel: €${totalEarnings}\n `,
        color: '#40abff',
        attachment_type: 'default',
      },
      createPaymentReport(dayreport),
      {
        title: `Branches en categorieën: €${cR.totaal.totaal}`,
        text: `Waarvan normale artikelen: €${cR.normaal.totaal} (${
          cR.normaal.percentage
        }%) (Normale artikelen zijn zonder vergunningen, levend aas, vissen en planten)`,
        color: '#ef3945',
        attachment_type: 'default',
      },
      createCategoryReport(cR),
      // {
      //   title: 'Inkooporders',
      //   color: '#ef3945',
      //   attachment_type: 'default',
      // },
      // createPurchaseReport(cR),
      {
        title: 'Artikelen\n ',
        text: 'Gesorteerd op omzet',
        color: '#ef3945',
        attachment_type: 'default',
      },
      createArticleReport(aR),
      // createStockReport(cR),
      // createDataReport(cR),
    ],
  }
}
