import _ from 'lodash'
import { asyncify, mapLimit } from 'async'
import { promisify } from 'util'
const pmapLimit = promisify(mapLimit)

import updateItem from '../api/lightspeed/update-item.js'

const uploadItem = async (item, key) => {
  console.log('Item Start:', item.itemID, 'Time:', new Date().toUTCString())
  let data = await updateItem(item.itemID, item.payload)
  console.log('Item Done: ', await data.Item.itemID)
}

export default async items => {
  // Sort to make order understandable
  let itemsToBeUpdated = _.sortBy(items, ['itemID'])

  // do individual items
  let updatedItems = await pmapLimit(itemsToBeUpdated, 1, asyncify(uploadItem))
}
