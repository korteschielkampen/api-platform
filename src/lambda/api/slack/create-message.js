import request from '../general/request.js'
import readAccessToken from '../slack-auth/read-token.js'

export default async message => {
  let access_token = await readAccessToken()
  const options = {
    method: 'POST',
    body: JSON.stringify(message),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  }
  const apiUrl = 'https://slack.com/api/chat.postMessage'
  console.log('REEEEEQUEEEEESSSSTING')
  return await request(apiUrl, options)
}
