import delay from 'delay'

export default async res => {
  let lsbucket = res.headers
    .get('x-ls-api-bucket-level')
    .split('/')
    .map(item => {
      return parseFloat(item)
    })
  let lsdrip = parseFloat(res.headers.get('x-ls-api-drip-rate'))
  let lscost = 10000 / lsdrip
  let lsdelay = (lsbucket[0] + 30) / lsbucket[1] * lscost
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
