import fetch from 'node-fetch'

export default async (apiUrl, options) => {
  const res = await fetch(apiUrl, options)
  if (!res.ok) {
    console.error('request failed')
    throw await res.json()
  } else {
    return await res.json()
  }
}
