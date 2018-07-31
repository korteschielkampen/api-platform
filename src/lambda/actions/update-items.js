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
  // Sort and remove 0 (cannot be updated)
  let itemsToBeUpdated = _.sortBy(items, ['itemID'])
  itemsToBeUpdated.find(i => {
    return i.itemID == '0'
  }) && itemsToBeUpdated.splice(_.findIndex(items, { itemID: '0' }), 1)
  let updatedItems = await pmapLimit(itemsToBeUpdated, 1, asyncify(uploadItem))
}
