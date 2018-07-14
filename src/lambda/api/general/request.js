import fetch from 'node-fetch'

export default async (apiUrl, options) => {
  const res = await fetch(apiUrl, options)
  if (!res.ok) {
    console.log('!!!! Request failed !!!!')
    throw await res.json()
  } else {
    console.log('Request Succes')
    return await res.json()
  }
}
