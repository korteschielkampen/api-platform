import _ from 'lodash'
import moment from 'moment'
import strictUriEncode from 'strict-uri-encode'

import request from '../general/request.js'
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
  let apiUrl = `https://api.lightspeedapp.com/API/Account/159502/Item/${itemID}.json?load_relations=["TagRelations.Tag"]`
  let tempItem = await request(apiUrl, options)
  return await tempItem.Item
}
