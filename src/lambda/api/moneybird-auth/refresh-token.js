import request from '../general/request.js'

export default async refresh_token => {
  const payload = {
    client_id: process.env.MONEYBIRD_CLIENT,
    client_secret: process.env.MONEYBIRD_SECRET,
    redirect_uri: encodeURI('https://rjkorteschiel.nl/moneybird-redirect/'),
    refresh_token: refresh_token,
    grant_type: 'refresh_token',
  }
  const options = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  }
  const apiUrl = 'https://moneybird.com/oauth/token'

  return await request(apiUrl, options)
}
