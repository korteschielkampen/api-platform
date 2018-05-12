export default () => {
  return {
    text: 'Uw dagelijkse voorraadrapport:',
    channel: 'CAPCPRW6B',
    username: 'Lightspeed - Inkoop',
    icon_url:
      'https://integration-platform.korteschielkampen.nl/lightspeed.png',
    attachments: [
      {
        title: 'Inkooporders:',
        fields: [
          {
            title: '_Open:_ Leveranciersnaam',
            value: 'aangemaakt: 04-04-2018\nartikelen: xx, waarde: €xxx.xx',
            short: true,
          },
          {
            title: '_Open:_ Leveranciernaam',
            value: 'aangemaakt: 04-04-2018\nartikelen: xx, waarde: €xxx.xx',
            short: true,
          },
          {
            title: '_Besteld:_ Leveranciernaam',
            value:
              'aangemaakt: 04-04-2018\nverwacht: 10-04-2018\nartikelen: xx, waarde: €xxx.xx',
            short: true,
          },
          {
            title: '_Check-In:_ Leveranciernaam',
            value:
              'aangemaakt: 04-04-2018\nartikelen: xx, waarde: €xxx.xx\nverwerkt: xx, todo: xx',
            short: true,
          },
          {
            title: '_Check-In:_ Leveranciernaam',
            value:
              'aangemaakt: 04-04-2018\nartikelen: xx, waarde: €xxx.xx\nverwerkt: xx, todo: xx',
            short: true,
          },
          {
            title: '_Check-In:_ Leveranciernaam',
            value:
              'aangemaakt: 04-04-2018\nartikelen: xx, waarde: €xxx.xx\nverwerkt: xx, todo: xx',
            short: true,
          },
        ],
        color: '#ef3945',
        attachment_type: 'default',
        actions: [
          {
            name: 'Menu',
            text: 'Verander status',
            type: 'select',
            options: [
              {
                text: 'Inkooporder 1',
                value: '13',
              },
              {
                text: 'Inkooporder 2',
                value: '12',
              },
              {
                text: 'Inkooporder 3',
                value: '14',
              },
            ],
          },
          {
            name: 'Menu',
            text: 'Toon details',
            type: 'select',
            options: [
              {
                text: 'Inkooporder 1',
                value: '13',
              },
              {
                text: 'Inkooporder 2',
                value: '12',
              },
              {
                text: 'Inkooporder 3',
                value: '14',
              },
            ],
          },
        ],
      },
      {
        title: 'Te bestellen artikelen:',
        text: 'Te bestellen artikelen: xx voor €xxx.xx\n',
        color: '#ef3945',
        fields: [
          {
            title: 'Artikelnaam',
            value: 'laatst verkocht: 04-04-2018\nvoorraad: xx, bestelpunt: xx',
            short: true,
          },
          {
            title: 'Artikelnaam',
            value: 'laatst verkocht: 04-04-2018\nvoorraad: xx, bestelpunt: xx',
            short: true,
          },
          {
            title: 'Artikelnaam',
            value: 'laatst verkocht: 04-04-2018\nvoorraad: xx, bestelpunt: xx',
            short: true,
          },
          {
            title: 'Artikelnaam',
            value: 'laatst verkocht: 04-04-2018\nvoorraad: xx, bestelpunt: xx',
            short: true,
          },
          {
            title: 'Artikelnaam',
            value: 'laatst verkocht: 04-04-2018\nvoorraad: xx, bestelpunt: xx',
            short: true,
          },
          {
            title: 'Artikelnaam',
            value: 'laatst verkocht: 04-04-2018\nvoorraad: xx, bestelpunt: xx',
            short: true,
          },
        ],
        attachment_type: 'default',
        actions: [
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
      },
    ],
  }
}
