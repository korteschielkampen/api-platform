export default dayreport => {
  return {
    text: 'Uw dagelijkse assortimentrapport:',
    channel: 'CAPCPRW6B',
    username: 'Lightspeed - Dagrapporten',
    icon_url:
      'https://integration-platform.korteschielkampen.nl/lightspeed.png',
    attachments: [
      {
        title: 'Nieuwe artikelen',
        fields: [
          {
            title: 'Artikelnaam',
            value:
              'voorraad: xx, bestelpunt: €xx.xx\ncategorie: categorie->subcategorie\nretail: €xx.xx, inkoop: €xx.xx',
            short: true,
          },
          {
            title: 'Artikelnaam',
            value:
              'voorraad: xx, bestelpunt: €xx.xx\ncategorie: categorie->subcategorie\nretail: €xx.xx, inkoop: €xx.xx',
            short: true,
          },
          {
            title: 'Artikelnaam',
            value:
              'voorraad: xx, bestelpunt: €xx.xx\ncategorie: categorie->subcategorie\nretail: €xx.xx, inkoop: €xx.xx',
            short: true,
          },
          {
            title: 'Artikelnaam',
            value:
              'voorraad: xx, bestelpunt: €xx.xx\ncategorie: categorie->subcategorie\nretail: €xx.xx, inkoop: €xx.xx',
            short: true,
          },
          {
            title: 'Artikelnaam',
            value:
              'voorraad: xx, bestelpunt: €xx.xx\ncategorie: categorie->subcategorie\nretail: €xx.xx, inkoop: €xx.xx',
            short: true,
          },
          {
            title: 'Artikelnaam',
            value:
              'voorraad: xx, bestelpunt: €xx.xx\ncategorie: categorie->subcategorie\nretail: €xx.xx, inkoop: €xx.xx',
            short: true,
          },
        ],
        actions: [
          {
            name: 'Menu',
            text: 'Archiveer artikel',
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
