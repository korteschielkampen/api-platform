import fetch from 'node-fetch'

export default async (apiUrl, options) => {
  const res = await fetch(apiUrl, options)
  if (!res.ok) {
    console.log('request failed')
    throw await res.json()
  } else {
    let lsbucket = res.headers.get('x-ls-api-bucket-level')
    let lsdrip = res.headers.get('x-ls-api-drip-rate')
    lsbucket != null &&
      console.log(`LS Ratelimit: ${lsbucket} and drips at ${lsdrip}p/s`)
    return await res.json()
  }
}
