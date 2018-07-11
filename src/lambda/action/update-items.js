import _ from 'lodash'
import { asyncify, map, mapLimit } from 'async'
import { promisify } from 'util'
const pmap = promisify(map)
const pmapLimit = promisify(mapLimit)

import updateItem from '../api/lightspeed/update-item.js'
import rateLimit from '../api/lightspeed/ratelimit.js'

const uploadItem = async (item, key) => {
  console.log('Item Start:', item.itemID, 'Time:', new Date().toUTCString())
  let res = await updateItem(item.itemID, item.payload)
  await rateLimit(res)
  let json = await res.json()
  console.log('Item Done: ', await json.Item.itemID)
}

export default async items => {
  let itemsToBeUpdated = _.sortBy(items, ['itemID'])
  let updatedItems = await pmapLimit(itemsToBeUpdated, 1, asyncify(uploadItem))
}
