import _ from 'lodash'
import moment from 'moment'
import strictUriEncode from 'strict-uri-encode'
import { asyncify, timesLimit } from 'async'
import { promisify } from 'util'
const ptimesLimit = promisify(timesLimit)

import request from './request-lightspeed.js'
import readAccessToken from '../lightspeed-auth/read-token.js'

export default async ({ itemIDs }) => {
  let access_token = await readAccessToken()
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }

  let stringifiedItemIDs
  if (itemIDs && itemIDs.length > 0) {
    let itemIDs = itemIDs.map(item => {
      return item.id
    })
    stringifiedItemIDs = JSON.stringify(itemIDs)
  }

  let account = 159502
  let relations = JSON.stringify([
    'Category',
    'ItemShops',
    'TagRelations.Tag',
    'TaxClass',
  ])

  let apiUrl = itemIDs
    ? `https://api.lightspeedapp.com/API/Account/${account}/Item.json?load_relations=${relations}&itemID=IN,${stringifiedItemIDs}`
    : `https://api.lightspeedapp.com/API/Account/${account}/Item.json?load_relations=${relations}`

  // Get saleslines
  let attributes = (await request(apiUrl, options, 1))['@attributes']
  let count = parseInt(attributes.count)
  let limit = parseInt(attributes.limit)
  let items = []
  await ptimesLimit(
    Math.ceil(count / limit),
    10,
    asyncify(async i => {
      let offset = i * limit
      apiUrl = apiUrl + `&offset=${offset}`
      let tempItems = await request(apiUrl, options, 1)
      items = _.concat(items, tempItems.Item)
    })
  )

  return await items
}
