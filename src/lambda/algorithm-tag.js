import moment from 'moment'
import fs from 'fs'
import _ from 'lodash'
import util from 'util'

import readSales from './api/lightspeed/read-sales.js'
import readItems from './api/lightspeed/read-items.js'
import updateItems from './actions/update-items.js'
import createSoldItems from './models/sales/sold-items.js'
import createMergedItems from './models/sales/merged-items.js'

const addTagToItems = (items, newTag) => {
  let itemsToBeUpdated = []
  _.forEach(items, item => {
    if (item.archived === 'false') {
      let itemToBeUpdated = {
        itemID: item.itemID,
        payload: {
          Tags: [],
        },
      }

      if (item.Tags) {
        if (typeof item.Tags.tag === 'string') {
          itemToBeUpdated.payload.Tags.push({ tag: item.Tags.tag })
          itemToBeUpdated.payload.Tags.push({ tag: newTag })
        } else {
          item.Tags.tag.forEach(tag => {
            itemToBeUpdated.payload.Tags.push({ tag: tag })
          })
          itemToBeUpdated.payload.Tags.push({ tag: newTag })
        }
      } else {
        itemToBeUpdated.payload.Tags.push({ tag: newTag })
      }

      itemsToBeUpdated.push(itemToBeUpdated)
    }
  })
  return itemsToBeUpdated
}

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }
  try {
    // Read the data from static
    let sales = JSON.parse(fs.readFileSync('./static/data/sales.json'))
    let items = JSON.parse(fs.readFileSync('./static/data/items.json'))

    // Get the sold items statistics and add them to the items themselves
    let soldItems = createSoldItems(sales)
    let itemsWithStats = createMergedItems(createSoldItems(sales), items, {
      lightweight: false,
    })

    // Remove itemID 0 because it cannot be updated
    itemsWithStats.splice(_.findIndex(itemsWithStats, { itemID: '0' }), 1)

    // Add tags
    let itemsToBeUpdated = addTagToItems(itemsWithStats, 'verkocht2018')

    // Upload items
    await updateItems(itemsToBeUpdated)

    respond({ status: 200, body: { message: 'succes' } })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
