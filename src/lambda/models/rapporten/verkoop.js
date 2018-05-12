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
    text: 'Uw dagelijkse verkooprapport:',
    channel: 'CAPCPRW6B',
    username: 'Lightspeed - Dagrapporten',
    icon_url:
      'https://integration-platform.korteschielkampen.nl/lightspeed.png',
    attachments: [
      {
        title: 'Inkomsten',
        text: `*Inkomsten: €${totalEarnings}*, waarvan €${
          dayreport.payments.cash.amount
        } in contanten. Deze zijn gelijk doorgezonden naar Moneybird, waar uw *kasboeksaldo €xxx.xx* is.`,
        color: '#ef3945',
        attachment_type: 'default',
        actions: [
          {
            name: 'Button',
            text: 'Voeg kasstorting toe',
            type: 'button',
          },
        ],
      },
      {
        title: 'Inkomsten - Uitsplitst per categorie',
        fields: [
          {
            title: 'Aquarium: €xxx.xx',
            value: 'Vissen: €xxx.xx\nPlanten: €xxx.xx',
            short: true,
          },
          {
            title: 'Hengelsport: €xxx.xx',
            value: 'Vergunningen: €xxx.xx\nAas: €xxx.xx',
            short: true,
          },
          {
            title: 'Dierenspeciaalzaak: €xxx.xx',
            value: 'Voeders: €xxx.xx\nKauwproducten: €xxx.xx',
            short: true,
          },
          {
            title: 'Uitzonderingen: €xxx.xx',
            value: 'Ongecategoriseerd: €xxx.xx\nDiversen: €xxx.xx',
            short: true,
          },
        ],
        color: '#ef3945',
        attachment_type: 'default',
        actions: [
          {
            name: 'Button',
            text: 'Catagoriseer Artikelen',
            type: 'button',
          },
        ],
      },
      {
        title: 'Artikelen - Meest verkocht:',
        fields: [
          {
            title: 'Artikelnaam',
            value: 'aantal: xx, totaal: €xx.xx\nvoorraad: xx, bestelpunt: xx',
            short: true,
          },
          {
            title: 'Artikelnaam',
            value: 'aantal: xx, totaal: €xx.xx\nvoorraad: xx, bestelpunt: xx',
            short: true,
          },
          {
            title: 'Artikelnaam',
            value: 'aantal: xx, totaal: €xx.xx\nvoorraad: xx, bestelpunt: xx',
            short: true,
          },
          {
            title: 'Artikelnaam',
            value: 'aantal: xx, totaal: €xx.xx\nvoorraad: xx, bestelpunt: xx',
            short: true,
          },
          {
            title: 'Artikelnaam',
            value: 'aantal: xx, totaal: €xx.xx\nvoorraad: xx, bestelpunt: xx',
            short: true,
          },
          {
            title: 'Artikelnaam',
            value: 'aantal: xx, totaal: €xx.xx\nvoorraad: xx, bestelpunt: xx',
            short: true,
          },
        ],
        actions: [
          {
            name: 'Menu',
            text: 'Plaats op inkooporder',
            type: 'select',
            options: [
              {
                text: 'Artikel 1',
                value: '13',
              },
              {
                text: 'Artikel 2',
                value: '12',
              },
              {
                text: 'Artikel 3',
                value: '14',
              },
            ],
          },
          {
            name: 'Menu',
            text: 'Pas nabestelpunt aan',
            type: 'select',
            options: [
              {
                text: 'Artikel 1',
                value: '13',
              },
              {
                text: 'Artikel 2',
                value: '12',
              },
              {
                text: 'Artikel 3',
                value: '14',
              },
            ],
          },
          {
            name: 'Button',
            text: 'Vorige',
            type: 'button',
          },
          {
            name: 'Button',
            text: 'Volgende',
            type: 'button',
          },
        ],
        color: '#ef3945',
        attachment_type: 'default',
      },
    ],
  }
}
