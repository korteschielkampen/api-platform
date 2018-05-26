import qS from 'query-string'
import moment from 'moment'

import createFile from '../api/slack/create-file.js'

export default async (data, channel) => {
  let highestValue = 0

  data.forEach(item => {
    if (
      item.categoryReport &&
      item.categoryReport.totaal &&
      item.categoryReport.totaal.totaal > highestValue
    ) {
      highestValue = item.categoryReport.totaal.totaal
    }
  })

  let chartData = [
    [
      data.map(item => {
        if (item.categoryReport && item.categoryReport.Dierenspeciaal) {
          return item.categoryReport.Dierenspeciaal.totaal / highestValue * 100
        } else {
          return 0
        }
      }),
    ],
    [
      data.map(item => {
        if (item.categoryReport && item.categoryReport.Aquarium) {
          return item.categoryReport.Aquarium.totaal / highestValue * 100
        } else {
          return 0
        }
      }),
    ],
    [
      data.map(item => {
        if (
          item &&
          item.categoryReport &&
          item.categoryReport.Hengelsport &&
          item.categoryReport.Hengelsport.Visvergunningen
        ) {
          return (
            item.categoryReport.Hengelsport.Visvergunningen.totaal /
            highestValue *
            100
          )
        } else {
          return 0
        }
      }),
    ],
    [
      data.map(item => {
        if (
          item.categoryReport &&
          item.categoryReport.Hengelsport &&
          item.categoryReport.Hengelsport.Visvergunningen
        ) {
          return (
            (item.categoryReport.Hengelsport.totaal -
              item.categoryReport.Hengelsport.Visvergunningen.totaal) /
            highestValue *
            100
          )
        } else if (item.categoryReport && item.categoryReport.Hengelsport) {
          return item.categoryReport.Hengelsport.totaal / highestValue * 100
        } else {
          return 0
        }
      }),
    ],
    [
      data.map(item => {
        if (item.categoryReport && item.categoryReport.etc) {
          return item.categoryReport.etc.totaal / highestValue * 100
        } else {
          return 0
        }
      }),
    ],
  ]

  chartData = chartData.map(value => {
    return value.join(',')
  })

  chartData = chartData.join('|')

  let labels = data.map(item => {
    let date = item.date.date
    let dateString = moment(date).format('DD-MMM')
    let value = item && item.categoryReport && item.categoryReport.totaal.totaal
    return `${dateString}: ${value || '0'}`
  })

  labels = labels.join('|')

  let bar = {
    chtt: 'Categorieën',
    chts: '000000,30,r',
    chs: '999x500',
    cht: 'bvs',
    chd: `t:${chartData}`,
    chco: 'fa8231,3867d6,97c4ad,20bf6b,a5b1c2',
    chxl: `0:|${labels}`,
    chxt: 'x',
  }

  let chartUrl = 'https://image-charts.com/chart?' + qS.stringify(bar)
  return [chartUrl]
}

//  // let chart = await createFile('none', channel)
