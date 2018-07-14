import request from '../general/request.js'

export default async temporary_access_token => {
  const client_id = process.env.SLACK_CLIENT
  const client_secret = process.env.SLACK_SECRET
  const redirect_uri = encodeURI(
    'https://integration-platform.korteschielkampen.nl/oauth/'
  )

  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }

  const apiUrl = `https://slack.com/api/oauth.access?client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}&code=${temporary_access_token}`

  return await request(apiUrl, options)
}
