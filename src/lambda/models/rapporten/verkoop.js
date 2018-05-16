import _ from 'lodash'

export default (dayreport, categoryReport) => {
  const totalEarnings = parseFloat(
    parseFloat(dayreport.payments.cash.amount) +
      parseFloat(dayreport.payments.pin.amount)
  ).toFixed(2)

  const totalSales = parseFloat(
    parseFloat(dayreport.tax.hoog.amount) +
      parseFloat(dayreport.tax.laag.amount) +
      parseFloat(dayreport.tax.onbelast.amount)
  ).toFixed(2)

  categoryReport.etc =
    categoryReport.Ongecategoriseerd + categoryReport.Diversen

  let categoryReportFixed = {}
  _.map(categoryReport, (value, key) => {
    categoryReportFixed[key] = value.toFixed(2)
  })

  return {
    text: 'Uw dagelijkse rapport:',
    channel: 'CAPCPRW6B',
    username: 'Lightspeed - Dagrapporten',
    icon_url:
      'https://integration-platform.korteschielkampen.nl/lightspeed.png',
    attachments: [
      {
        title: `---------------\nFinancieel: €${totalEarnings}\n---------------`,
        color: '#40abff',
        attachment_type: 'default',
      },
      {
        fields: [
          {
            title: 'Betalingen:',
            value: `Contanten: €${dayreport.payments.cash.amount}\nPIN: €${
              dayreport.payments.pin.amount
            }\nCadeau: €${dayreport.payments.gift.amount}\nKrediet: €${
              dayreport.payments.credit.amount
            }`,
            short: true,
          },
          // {
          //   title: 'Boekhouding:',
          //   value:
          //     'Credite.: €xxx.xx\nDebite.: €xxx.xx\nKas: €xxx.xx\nBank: €xxx.xx\nToekomst: €xxx.xx',
          //   short: true,
          // },
        ],

        color: '#40abff',
        attachment_type: 'default',
        // actions: [
        //   {
        //     name: 'Button',
        //     text: 'Voeg kasstorting toe',
        //     type: 'button',
        //   },
        // ],
      },
      {
        title: '---------------\nBranches en categorieën\n---------------',
        color: '#ef3945',
        attachment_type: 'default',
      },
      {
        fields: [
          {
            title: `Aqua: €${categoryReportFixed.Aquarium}`,
            value: `Vissen: €${categoryReportFixed.Vis}\nPlanten: €${
              categoryReportFixed.Planten
            }`,
            short: true,
          },
          {
            title: `Hengel: €${categoryReportFixed.Hengelsport}`,
            value: `Passen: €${categoryReportFixed.Passen}\nAas: €${
              categoryReportFixed.Aas
            }`,
            short: true,
          },
          {
            title: `Dieren: €${categoryReportFixed.Dierenspeciaal}`,
            value: `Voeders: €${categoryReportFixed.Voeders}\nKauw: €${
              categoryReportFixed.Kauw
            }`,
            short: true,
          },
          {
            title: `Etc.: €${categoryReportFixed.etc}`,
            value: `Ongecat.: €${
              categoryReportFixed.Ongecategoriseerd
            }\nDivers: €${categoryReportFixed.Diversen}`,
            short: true,
          },
        ],
        color: '#ef3945',
        attachment_type: 'default',
        // actions: [
        //   {
        //     name: 'Button',
        //     text: 'Aquarium',
        //     type: 'button',
        //   },
        //   {
        //     name: 'Button',
        //     text: 'Hengelsport',
        //     type: 'button',
        //   },
        //   {
        //     name: 'Button',
        //     text: 'Dierenspeciaalzaak',
        //     type: 'button',
        //   },
        // ],
      },
      // {
      //   title: '---------------\nInkooporders\n---------------',
      //   color: '#ef3945',
      //   attachment_type: 'default',
      // },
      // {
      //   fields: [
      //     {
      //       title: 'Open: xx',
      //       value: 'orders: xx, atikelen: xx, waarde: €xxx.xx',
      //     },
      //     {
      //       title: 'Besteld: xx',
      //       value: 'orders: xx artikelen: xx, waarde: €xxx.xx',
      //     },
      //     {
      //       title: 'Check-In: xx',
      //       value: 'orders: xx, atikelen: xx, waarde: €xxx.xx',
      //     },
      //   ],
      //   color: '#ef3945',
      //   attachment_type: 'default',
      //   actions: [
      //     {
      //       name: 'Button',
      //       text: 'Open',
      //       type: 'button',
      //     },
      //     {
      //       name: 'Button',
      //       text: 'Besteld',
      //       type: 'button',
      //     },
      //     {
      //       name: 'Button',
      //       text: 'Check-In',
      //       type: 'button',
      //     },
      //   ],
      // },
      {
        title: '---------------\nArtikelen\n---------------',
        color: '#ef3945',
        attachment_type: 'default',
      },
      {
        text: `*Inzicht*: Orden artikelen met`,
        color: '#ef3945',
        attachment_type: 'default',
        actions: [
          {
            name: 'Button',
            text: 'Aantal',
            type: 'button',
          },
          {
            name: 'Button',
            text: 'Omzet',
            type: 'button',
          },
          {
            name: 'Button',
            text: 'Winstgevendheid',
            type: 'button',
          },
        ],
      },
      // {
      //   text: `*Voorraad*: Orden artikelen bij en voor handeling uit op`,
      //   color: '#ef3945',
      //   attachment_type: 'default',
      //   actions: [
      //     {
      //       name: 'Button',
      //       text: 'Nabestellen',
      //       type: 'button',
      //     },
      //     {
      //       name: 'Button',
      //       text: 'Voorraad',
      //       type: 'button',
      //     },
      //   ],
      // },
      // {
      //   text: `*Datakwaliteit*: Orden artikelen bij en voor handeling uit op`,
      //   color: '#ef3945',
      //   attachment_type: 'default',
      //   actions: [
      //     {
      //       name: 'Button',
      //       text: 'Categoriseren',
      //       type: 'button',
      //     },
      //     {
      //       name: 'Button',
      //       text: 'Nieuw',
      //       type: 'button',
      //     },
      //     {
      //       name: 'Button',
      //       text: 'Archiveren',
      //       type: 'button',
      //     },
      //   ],
      // },
    ],
  }
}
