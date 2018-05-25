import createFile from '../api/slack/create-file.js'
import qS from 'query-string'

export default async (cR, channel) => {
  console.log(cR)
  let data = [
    [
      cR.Dierenspeciaal.percentage,
      cR.Aquarium.percentage,
      cR.Hengelsport.percentage,
      cR.etc.percentage,
    ],
  ]

  data = data.map(value => {
    return value.join(',')
  })
  data = data.join('|')
  console.log(`t:${data}`)

  let line = {
    chtt: 'Categorieën',
    chts: '000000,30,r',
    chs: '999x500',
    cht: 'lxy:nda',
    chd: 't:10,20,40,80,90,95,99|20,30,40,50,60,70,80|-1|5,10,22,35,85',
  }

  let chartUrl = 'https://image-charts.com/chart?' + qS.stringify(line)
  console.log(chartUrl)
  return chartUrl
}

//  // let chart = await createFile('none', channel)
