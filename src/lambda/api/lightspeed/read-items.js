import _ from 'lodash'
import moment from 'moment'
import strictUriEncode from 'strict-uri-encode'

import request from './request-lightspeed.js'
import readAccessToken from '../lightspeed-auth/read-token.js'

export default async soldItems => {
  let access_token = await readAccessToken()
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }

  let stringifiedItemIDs
  if (soldItems && soldItems.length > 0) {
    let itemIDs = soldItems.map(item => {
      return item.id
    })
    stringifiedItemIDs = JSON.stringify(itemIDs)
  }

  // Paginator
  let items = []
  let offset = 0
  let count = 1
  while (offset < count) {
    let apiUrl = ''
    if (soldItems) {
      apiUrl = `https://api.lightspeedapp.com/API/Account/159502/Item.json?load_relations=["Category", "ItemShops", "TagRelations.Tag", "TaxClass"]&offset=${offset}&itemID=IN,${stringifiedItemIDs}`
    } else {
      apiUrl = `https://api.lightspeedapp.com/API/Account/159502/Item.json?load_relations=["Category", "ItemShops", "TagRelations.Tag", "TaxClass"]&offset=${offset}`
    }
    let tempItems = await request(apiUrl, options, 1)
    items = _.concat(items, tempItems.Item)
    count = parseInt(tempItems['@attributes'].count)
    offset += parseInt(tempItems['@attributes'].limit)
  }

  return await items
}
