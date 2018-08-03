import _ from 'lodash'
import { asyncify, timesLimit } from 'async'
import { promisify } from 'util'
const ptimesLimit = promisify(timesLimit)

import request from './request-lightspeed.js'
import readAccessToken from '../lightspeed-auth/read-token.js'
import cleanItems from './clean-items.js'

export default async ({ itemIDs = undefined }) => {
  let access_token = await readAccessToken()
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }

  let account = 159502
  let relations = JSON.stringify([
    'ItemShops',
    'TagRelations.Tag',
    'TaxClass',
    'CustomFieldValues',
    'Category',
  ])

  let apiUrl = `https://api.lightspeedapp.com/API/Account/${account}/Item.json?load_relations=${relations}`

  // Get items by ID -> Needs to be handled differently due to querylength limitations
  let items = []
  if (itemIDs) {
    console.log('Getting items by ID')
    itemIDs = _.map(itemIDs, item => {
      return item.itemID
    })
    await ptimesLimit(
      Math.ceil(itemIDs.length / 100),
      10,
      asyncify(async i => {
        let stringifiedItemIDs = JSON.stringify(
          itemIDs.slice(i * 100, i * 100 + 100)
        )
        let apiUrlItems = apiUrl + `&itemID=IN,${stringifiedItemIDs}`
        let tempItems = await request(apiUrlItems, options, 1)
        items = _.concat(items, tempItems.Item)
      })
    )

    // Get all items
  } else {
    console.log('Getting all items')
    let attributes = (await request(apiUrl, options, 1))['@attributes']
    let count = parseInt(attributes.count)
    let limit = parseInt(attributes.limit)
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
  }
  return await cleanItems(items)
}
