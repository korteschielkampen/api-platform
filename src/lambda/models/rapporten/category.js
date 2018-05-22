import _ from 'lodash'

export default cR => {
  return {
    fields: [
      cR.Aquarium && {
        title: `Aqua: €${cR.Aquarium.totaal +
          ' (' +
          cR.Aquarium.percentage +
          '%)' || '0'}`,
        value: `Vis: €${
          cR.Aquarium.Vis
            ? cR.Aquarium.Vis.totaal + ' (' + cR.Aquarium.Vis.percentage + '%)'
            : '0'
        }\nPlant: €${
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
        value: `Pas: €${
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
        value: `Oncat: €${
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
  }
}
