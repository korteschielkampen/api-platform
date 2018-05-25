import createFile from '../api/slack/create-file.js'
import qS from 'query-string'

export default async (data, channel) => {
  // console.log(data[0])

  let chartData = [
    [
      data.map(item => {
        return item.categoryReport.Dierenspeciaal.percentage
      }),
    ],
    [
      data.map(item => {
        return item.categoryReport.Aquarium.percentage
      }),
    ],
    [
      data.map(item => {
        return item.categoryReport.Hengelsport.percentage
      }),
    ],
    [
      data.map(item => {
        return item.categoryReport.etc.percentage
      }),
    ],
  ]

  chartData = chartData.map(value => {
    return value.join(',')
  })

  chartData = chartData.join('|')
  console.log(`t:${chartData}`)

  let bar = {
    chtt: 'Categorieën',
    chts: '000000,30,r',
    chs: '999x500',
    cht: 'bvs',
    chd: `t:${chartData}`,
    chco: 'fa8231,3867d6,20bf6b,a5b1c2',
    chxl: '0:|Dag 1|Dag 2|Dag 3',
    chxt: 'x',
  }

  let chartUrl = 'https://image-charts.com/chart?' + qS.stringify(bar)
  console.log(chartUrl)
  return [chartUrl]
}

//  // let chart = await createFile('none', channel)
