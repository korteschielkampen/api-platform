import qS from 'query-string'
import moment from 'moment'

import createFile from '../api/slack/create-file.js'

export default async (data, channel) => {
  let highestValue = 0

  data.forEach(item => {
    if (
      item.financialReport &&
      item.financialReport.analysis &&
      item.financialReport.analysis.total > highestValue
    ) {
      highestValue = item.financialReport.analysis.total
    }
  })

  let chartData = [
    [
      data.map(item => {
        if (item.financialReport && item.financialReport.analysis) {
          return item.financialReport.analysis.total / highestValue * 100
        } else {
          return 0
        }
      }),
    ],
    [
      data.map(item => {
        if (item.financialReport && item.financialReport.analysis) {
          return item.financialReport.analysis.profit / highestValue * 100
        } else {
          return 0
        }
      }),
    ],
    [
      data.map(item => {
        return 200 / highestValue * 100
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
    chs: '999x700',
    cht: 'lc',
    chd: `t:${chartData}`,
    // chd: 't:10,15,20|50,60,70',
    chco: '000000,00e370,f06372',
    chxl: `0:|${labels}`,
    chxt: 'x',
  }

  let chartUrl = 'https://image-charts.com/chart?' + qS.stringify(bar)
  return chartUrl
}

//  // let chart = await createFile('none', channel)
