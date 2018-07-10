import fetch from 'node-fetch'

export default async (apiUrl, options) => {
  const res = await fetch(apiUrl, options)
  if (!res.ok) {
    console.log('request failed')
    throw await res.json()
  } else {
    return res
  }
}
