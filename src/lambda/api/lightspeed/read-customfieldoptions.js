import _ from 'lodash'
import moment from 'moment'
import strictUriEncode from 'strict-uri-encode'

import request from './request-lightspeed.js'
import readAccessToken from '../lightspeed-auth/read-token.js'

export default async fieldID => {
  let access_token = await readAccessToken()
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }

  // Paginator
  let fieldOptions = []
  let offset = 0
  let count = 1
  let accountID = 159502
  while (offset < count) {
    let apiUrl = `https://api.lightspeedapp.com/API/Account/${accountID}/Item/CustomField/${fieldID}/CustomFieldChoice.json?offset=${offset}`
    let tempFieldOptions = await request(apiUrl, options, 1)
    fieldOptions = _.concat(fieldOptions, tempFieldOptions)
    count = parseInt(tempFieldOptions['@attributes'].count)
    offset += parseInt(tempFieldOptions['@attributes'].limit)
  }

  return await fieldOptions
}
