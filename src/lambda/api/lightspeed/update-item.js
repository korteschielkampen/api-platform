import request from './request-lightspeed.js'
import readAccessToken from '../lightspeed-auth/read-token.js'

export default async (itemID, payload) => {
  let access_token = await readAccessToken()
  const options = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(payload),
  }

  let account = 159502
  let relations = JSON.stringify(['ItemShops', 'TagRelations.Tag'])

  let apiUrl = `https://api.lightspeedapp.com/API/Account/${account}/Item/${itemID}.json?load_relations=${relations}`
  return await request(apiUrl, options, 1)
}
