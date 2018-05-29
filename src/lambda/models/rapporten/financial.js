import _ from 'lodash'

export default ({ charts, financialReport: fR }) => {
  return [
    {
      title: `Financieel`,
      text: `Het bruto resultaat is €${fR.analysis.profit.toFixed(
        0
      )}, maar ${fR.analysis.unreliabilityCount.toFixed(
        0
      )} artikelen hebben geen inkoopsprijs. Het gaat om een omzet van €${fR.analysis.unreliabilityTotal.toFixed(
        0
      )} en dit is verrekend met een winstmarge van 30%.`,
      color: '#ef3945',
      attachment_type: 'default',
    },
    {
      fields: [
        {
          title: 'Analyse',
          value: `Omzet: €${fR.analysis.taxlessTotal.toFixed(
            0
          )}\nB.Resultaat: €${fR.analysis.profit.toFixed(
            0
          )}\nVerkopen: ${fR.analysis.sales.toFixed(
            0
          )}x\nGem. Verkoop: €${fR.analysis.saleSize.toFixed(
            0
          )}\nGem. Marge: ${fR.analysis.margin.toFixed(0)}%`,
          short: true,
        },
        {
          title: 'Betalingen',
          value: `Contant: €${parseFloat(fR.payments.cash.amount).toFixed(
            0
          )}\nPIN: €${parseFloat(fR.payments.pin.amount).toFixed(
            0
          )}\nCadeau: €${parseFloat(fR.payments.gift.amount).toFixed(
            0
          )}\nKrediet: €${parseFloat(fR.payments.credit.amount).toFixed(0)}`,
          short: true,
        },
        // {
        //   title: 'Boekhouding:',
        //   value:
        //     'Credite.: €xxx.xx\nDebite.: €xxx.xx\nKas: €xxx.xx\nBank: €xxx.xx\nToekomst: €xxx.xx',
        //   short: true,
        // },
      ],

      color: '#ef3945',
      attachment_type: 'default',
      image_url: charts.financial,
      // actions: [
      //   {
      //     name: 'Button',
      //     text: 'Voeg kasstorting toe',
      //     type: 'button',
      //   },
      // ],
    },
  ]
}
