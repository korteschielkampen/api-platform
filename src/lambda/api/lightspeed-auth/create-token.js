import request from '../general/request.js'

export default async temporary_access_token => {
  const payload = {
    client_id: process.env.LIGHTSPEED_CLIENT,
    client_secret: process.env.LIGHTSPEED_SECRET,
    code: temporary_access_token,
    grant_type: 'authorization_code',
  }
  const options = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  }
  const apiUrl = 'https://cloud.lightspeedapp.com/oauth/access_token.php'

  return await request(apiUrl, options)
}
