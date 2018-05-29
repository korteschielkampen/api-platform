import qS from 'query-string'
import moment from 'moment'

import createFile from '../api/slack/create-file.js'

export default async (data, channel) => {
  let highestValue = 0

  data.forEach(item => {
    if (
      item.financialReport &&
      item.financialReport.analysis &&
      item.financialReport.analysis.taxlessTotal > highestValue
    ) {
      highestValue = item.financialReport.analysis.taxlessTotal
    }
  })

  let chartData = [
    [
      data.map(item => {
        if (item.financialReport && item.financialReport.analysis) {
          return (
            item.financialReport.analysis.profit /
            highestValue *
            100
          ).toFixed(1)
        } else {
          return 0
        }
      }),
    ],
    [
      data.map(item => {
        if (item.financialReport && item.financialReport.analysis) {
          return (
            item.financialReport.analysis.profitRent /
            highestValue *
            100
          ).toFixed(1)
        } else {
          return (item.special.rentIncome / highestValue * 100).toFixed(1)
        }
      }),
    ],
    [
      data.map(item => {
        return (item.special.indirectCost / highestValue * 100).toFixed(1)
      }),
    ],
    [
      data.map(item => {
        return (item.special.dailyTotalCost / highestValue * 100).toFixed(1)
      }),
    ],
    [
      data.map(item => {
        if (item.financialReport && item.financialReport.analysis) {
          return (
            item.financialReport.analysis.taxlessTotal /
            highestValue *
            100
          ).toFixed(1)
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

  let fR = data[data.length - 1].financialReport
  let labels = data.map(item => {
    let date = item.date.date
    let dateString = moment(date).format('DD-MMM')

    let value =
      item &&
      item.financialReport &&
      item.financialReport.analysis &&
      item.financialReport.analysis.taxlessTotal.toFixed(0)
    return `${dateString}: ${value || '0'}`
  })

  labels = labels.join('|')

  let bar = {
    chtt: 'Inkomsten',
    chts: '000000,30,r',
    chs: '999x600',
    cht: 'ls',
    chd: `t:${chartData}`,
    chco: '2ed573,2ed573,ff4757,ff4757,a4b0be',
    chm: 'B,a4b0be66,4,4,4|B,ff475766,2,2,2|B,2ed573BB,0,0,0',
    chxl: `0:|${labels}`,
    chxt: 'x',
    chls: '5|2,10,10|5|2,10,10|5',
    chdl: `Winst (${fR.analysis.totalProfit.toFixed(
      0
    )})  |Winst met Gebouwen (${fR.analysis.totalProfitPlusRent.toFixed(
      0
    )})  |Kosten (${fR.analysis.totalCost.toFixed(
      0
    )})  |Kosten met Leningen (${fR.analysis.totalCostPlusLoans.toFixed(
      0
    )})  |Omzet (${fR.analysis.totalRevenue.toFixed(0)})  `,
  }

  let chartUrl = 'https://image-charts.com/chart?' + qS.stringify(bar)
  return chartUrl
}

//  // let chart = await createFile('none', channel)
