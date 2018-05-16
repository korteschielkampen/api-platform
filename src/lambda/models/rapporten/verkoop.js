export default dayreport => {
  const totalEarnings = parseFloat(
    parseFloat(dayreport.payments.cash.amount) +
      parseFloat(dayreport.payments.pin.amount)
  ).toFixed(2)

  const totalSales = parseFloat(
    parseFloat(dayreport.tax.hoog.amount) +
      parseFloat(dayreport.tax.laag.amount) +
      parseFloat(dayreport.tax.onbelast.amount)
  ).toFixed(2)

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
            }\neCom: €xxx.xx`,
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
            title: 'Aqua: €xxx.xx',
            value: 'Vissen: €xxx.xx\nPlanten: €xxx.xx',
            short: true,
          },
          {
            title: 'Hengel: €xxx.xx',
            value: 'Passen: €xxx.xx\nAas: €xxx.xx',
            short: true,
          },
          {
            title: 'Dieren: €xxx.xx',
            value: 'Voeders: €xxx.xx\nKauw: €xxx.xx',
            short: true,
          },
          {
            title: 'Etc.: €xxx.xx',
            value: 'Ongecat.: €xxx.xx\nDivers: €xxx.xx',
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
        text: `*Inzicht*: Orden artikelen bij en voor handeling uit op`,
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
