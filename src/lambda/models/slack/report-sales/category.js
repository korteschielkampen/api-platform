import _ from 'lodash'

export default ({ charts, categoryReport: cR }) => {
  return [
    {
      title: `Branches en categorieën`,
      text: `Waarvan normale artikelen: €${cR.normaal.totaal} (${
        cR.normaal.percentage
      }%). Abnormale artikelen zijn: Vergunningen, levend aas, vissen en planten.`,
      color: '#ef3945',
      attachment_type: 'default',
    },
    {
      fields: [
        {
          title: `Aqua: €${(cR.Aquarium && cR.Aquarium.totaal) ||
            0} (${(cR.Aquarium && cR.Aquarium.percentage) || 0}%)`,
          ...(cR.Aquarium && {
            value: `Vis: €${
              cR.Aquarium.Vis
                ? cR.Aquarium.Vis.totaal +
                  ' (' +
                  cR.Aquarium.Vis.percentage +
                  '%)'
                : '0'
            }\nPlant: €${
              cR.Aquarium.Planten
                ? cR.Aquarium.Planten.totaal +
                  ' (' +
                  cR.Aquarium.Planten.percentage +
                  '%)'
                : '0'
            }`,
          }),
          short: true,
        },
        {
          title: `Hengel: €${(cR.Hengelsport && cR.Hengelsport.totaal) ||
            0} (${(cR.Hengelsport && cR.Hengelsport.percentage) || 0}%)`,
          short: true,
          ...(cR.Hengelsport && {
            value: `Vispas: €${
              cR.Hengelsport.Visvergunningen
                ? cR.Hengelsport.Visvergunningen.totaal +
                  ' (' +
                  cR.Hengelsport.Visvergunningen.percentage +
                  '%)'
                : '0'
            }\nL.Aas: €${
              cR.Hengelsport['Levend Aas']
                ? cR.Hengelsport['Levend Aas'].totaal +
                  ' (' +
                  cR.Hengelsport['Levend Aas'].percentage +
                  '%)'
                : '0'
            }`,
          }),
        },
        {
          title: `Dieren: €${(cR.Dierenspeciaal && cR.Dierenspeciaal.totaal) ||
            0} (${(cR.Dierenspeciaal && cR.Dierenspeciaal.percentage) || 0}%)`,
          ...(cR.Dierenspeciaal && {
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
            }\nOndier: €${
              cR.Dierenspeciaal.Ongediertebestrijding
                ? cR.Dierenspeciaal.Ongediertebestrijding.totaal +
                  ' (' +
                  cR.Dierenspeciaal.Ongediertebestrijding.percentage +
                  '%)'
                : '0'
            }`,
          }),
          short: true,
        },
        {
          title: `Etc: €${(cR.etc && cR.etc.totaal) || 0} (${(cR.etc &&
            cR.etc.percentage) ||
            0}%)`,
          ...(cR.etc && {
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
          }),
          short: true,
        },
      ],
      color: '#ef3945',
      attachment_type: 'default',
    },
  ]
}
