import _ from 'lodash'
import moment from 'moment'
import strictUriEncode from 'strict-uri-encode'

import request from '../general/request.js'
import readAccessToken from '../lightspeed-auth/read-token.js'

export default async soldItems => {
  let access_token = await readAccessToken()
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }

  // Paginator
  let categories = []
  let offset = 0
  let count = 1
  while (offset < count) {
    let apiUrl = ''
    if (soldItems) {
      apiUrl = `https://api.lightspeedapp.com/API/Account/159502/Category.json?offset=${offset}`
    } else {
      apiUrl = `https://api.lightspeedapp.com/API/Account/159502/Category.json?offset=${offset}`
    }
    let tempItems = await request(apiUrl, options)
    categories = _.concat(categories, tempItems.Category)
    count = parseInt(tempItems['@attributes'].count)
    offset += parseInt(tempItems['@attributes'].limit)
  }

  return await categories
}
