import _ from 'lodash'

export default (dayreport, cR) => {
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

  console.log(cR)

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
        title: `Branches en categorieën: €${cR.totaal.totaal}\n `,
        color: '#ef3945',
        attachment_type: 'default',
      },
      {
        fields: [
          cR.Aquarium && {
            title: `Aqua: €${cR.Aquarium.totaal +
              ' (' +
              cR.Aquarium.percentage +
              '%)' || '0'}`,
            value: `Vissen: €${
              cR.Aquarium.Vis
                ? cR.Aquarium.Vis.totaal +
                  ' (' +
                  cR.Aquarium.Vis.percentage +
                  '%)'
                : '0'
            }\nPlanten: €${
              cR.Aquarium.Planten
                ? cR.Aquarium.Planten.totaal +
                  ' (' +
                  cR.Aquarium.Planten.percentage +
                  '%)'
                : '0'
            }`,
            short: true,
          },
          cR.Hengelsport && {
            title: `Hengel: €${cR.Hengelsport.totaal +
              ' (' +
              cR.Hengelsport.percentage +
              '%)' || '0'}`,
            value: `Passen: €${
              cR.Hengelsport.Visvergunningen
                ? cR.Hengelsport.Visvergunningen.totaal +
                  ' (' +
                  cR.Hengelsport.Visvergunningen.percentage +
                  '%)'
                : '0'
            }\nAas: €${
              cR.Hengelsport.Aas
                ? cR.Hengelsport.Aas.totaal +
                  ' (' +
                  cR.Hengelsport.Aas.percentage +
                  '%)'
                : '0'
            }`,
            short: true,
          },
          cR.Dierenspeciaal && {
            title: `Dieren: €${cR.Dierenspeciaal.totaal +
              ' (' +
              cR.Dierenspeciaal.percentage +
              '%)' || '0'}`,
            value: `Kat: €${
              cR.Dierenspeciaal.Katten
                ? cR.Dierenspeciaal.Katten.totaal +
                  ' (' +
                  cR.Dierenspeciaal.Katten.percentage +
                  '%)'
                : '0'
            }\nHond: €${
              cR.Dierenspeciaal.Honden
                ? cR.Dierenspeciaal.Honden.totaal +
                  ' (' +
                  cR.Dierenspeciaal.Honden.percentage +
                  '%)'
                : '0'
            }\nVogel: €${
              cR.Dierenspeciaal.Vogels
                ? cR.Dierenspeciaal.Vogels.totaal +
                  ' (' +
                  cR.Dierenspeciaal.Vogels.percentage +
                  '%)'
                : '0'
            }\nKnaag: €${
              cR.Dierenspeciaal.Knaagdieren
                ? cR.Dierenspeciaal.Knaagdieren.totaal +
                  ' (' +
                  cR.Dierenspeciaal.Knaagdieren.percentage +
                  '%)'
                : '0'
            }`,
            short: true,
          },
          cR.etc && {
            title: `Etc.: €${cR.etc.totaal + ' (' + cR.etc.percentage + '%)' ||
              '0'}`,
            value: `Ongecat.: €${
              cR.Ongecategoriseerd
                ? cR.Ongecategoriseerd.totaal +
                  ' (' +
                  cR.Ongecategoriseerd.percentage +
                  '%)'
                : '0'
            }\nDivers: €${
              cR.Diversen
                ? cR.Diversen.totaal + ' (' + cR.Diversen.percentage + '%)'
                : '0'
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
        title: 'Artikelen\n ',
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
