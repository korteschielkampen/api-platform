import _ from 'lodash'

export default (dayreport, categoryReport) => {
  const totalEarnings = parseFloat(
    parseFloat(dayreport.payments.cash.amount) +
      parseFloat(dayreport.payments.pin.amount) +
      parseFloat(dayreport.payments.gift.amount) +
      parseFloat(dayreport.payments.credit.amount)
  ).toFixed(2)

  const totalSales = parseFloat(
    parseFloat(dayreport.tax.hoog.amount) +
      parseFloat(dayreport.tax.laag.amount) +
      parseFloat(dayreport.tax.onbelast.amount)
  ).toFixed(2)

  console.log(categoryReport)

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
        title: `---------------\nBranches en categorieën: €${
          categoryReport.totaal.totaal
        }\n---------------`,
        color: '#ef3945',
        attachment_type: 'default',
      },
      {
        fields: [
          categoryReport.Aquarium && {
            title: `Aqua: €${categoryReport.Aquarium.totaal || '0'}`,
            value: `Vissen: €${
              categoryReport.Aquarium.Vis
                ? categoryReport.Aquarium.Vis.totaal
                : '0'
            }\nPlanten: €${
              categoryReport.Aquarium.Planten
                ? categoryReport.Aquarium.Planten.totaal
                : '0'
            }`,
            short: true,
          },
          categoryReport.Hengelsport && {
            title: `Hengel: €${categoryReport.Hengelsport.totaal}`,
            value: `Passen: €${
              categoryReport.Hengelsport.Passen
                ? categoryReport.Hengelsport.Passen.totaal
                : '0'
            }\nAas: €${
              categoryReport.Hengelsport.Aas
                ? categoryReport.Hengelsport.Aas.totaal
                : '0'
            }`,
            short: true,
          },
          categoryReport.Dierenspeciaal && {
            title: `Dieren: €${categoryReport.Dierenspeciaal.totaal || '0'}`,
            value: `Katten: €${
              categoryReport.Dierenspeciaal.Katten
                ? categoryReport.Dierenspeciaal.Katten.totaal
                : '0'
            }\nHonden: €${
              categoryReport.Dierenspeciaal.Honden
                ? categoryReport.Dierenspeciaal.Honden.totaal
                : '0'
            }\nVogels: €${
              categoryReport.Dierenspeciaal.Vogels
                ? categoryReport.Dierenspeciaal.Vogels.totaal
                : '0'
            }\nKnaag: €${
              categoryReport.Dierenspeciaal.Knaagdieren
                ? categoryReport.Dierenspeciaal.Knaagdieren.totaal
                : '0'
            }`,
            short: true,
          },
          categoryReport.etc && {
            title: `Etc.: €${categoryReport.etc.totaal || '0'}`,
            value: `Ongecat.: €${
              categoryReport.Ongecategoriseerd
                ? categoryReport.Ongecategoriseerd.totaal
                : '0'
            }\nDivers: €${
              categoryReport.Diversen ? categoryReport.Diversen.totaal : '0'
            }`,
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
      //   text: `*Voorraad*: Orden artikelen met`,
      //   color: '#ef3945',
      //   attachment_type: 'default',
      //   actions: [
      //     {
      //       name: 'Button',
      //       text: 'Nabestellen',
      //       type: 'button',
      //     },
      //   ],
      // },
      // {
      //   text: `*Datakwaliteit*: Orden artikelen met`,
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
      //       text: 'Nieuwigheid',
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
