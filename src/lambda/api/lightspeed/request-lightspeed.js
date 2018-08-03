import delay from 'delay'

import request from '../general/request-with-headers.js'

const ratelimit = async (res, cost) => {
  let lsbucket = res.headers
    .get('x-ls-api-bucket-level')
    .split('/')
    .map(item => {
      return parseFloat(item)
    })
  let lsdrip = parseFloat(res.headers.get('x-ls-api-drip-rate'))
  let lscost = cost * 10000 / lsdrip
  let lsdelay = 0
  if (lsbucket[0] > lsbucket[1] / 4) {
    lsdelay =
      Math.pow((lsbucket[0] + lsbucket[1] / 2) / lsbucket[1], 10) * lscost
  }
  console.log(
    'LSBucket:',
    lsbucket[0].toFixed(2),
    lsbucket[1].toFixed(2),
    'LSRate:',
    lsdrip.toFixed(2),
    'Decided Delay:',
    lsdelay.toFixed(2)
  )
  await delay(lsdelay)
  return true
}

export default async (apiUrl, options, cost) => {
  let res = await request(apiUrl, options)
  await ratelimit(res, cost)
  let json = await res.json()
  return await json
}
