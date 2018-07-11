import moment from 'moment'
import fs from 'fs'
import _ from 'lodash'
import util from 'util'

import readSales from './api/lightspeed/read-sales.js'
import readItems from './api/lightspeed/read-items.js'
import updateItems from './action/update-items.js'
import createSoldItems from './transformation/lightspeed-sales--to--sold-items.js'

const addTag = (items, tag) => {
  let newTag = tag
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
    let sales = JSON.parse(fs.readFileSync('./static/data/sales.json'))
    let items = JSON.parse(fs.readFileSync('./static/data/items.json'))

    let soldItems = createSoldItems(sales)

    let soldItemsHashed = {}
    soldItems.forEach(i => {
      if (soldItemsHashed[i.id]) {
        soldItemsHashed[i.id] = {
          itemID: i.id,
          statistics: {
            totalSold: soldItemsHashed[i.id].statistics.totalSold + i.quantity,
            totalRevenue:
              soldItemsHashed[i.id].statistics.totalRevenue + i.value,
            valueWithTax:
              soldItemsHashed[i.id].statistics.valueWithTax + i.valueWithTax,
          },
        }
      } else {
        soldItemsHashed[i.id] = {
          itemID: i.id,
          statistics: {
            totalSold: i.quantity,
            totalRevenue: i.value,
            valueWithTax: i.valueWithTax,
          },
        }
      }
    })

    delete soldItemsHashed[0]

    let itemsHashed = {}
    items.forEach(i => {
      itemsHashed[i.itemID] = i
    })

    let itemsMerged = _.map(soldItemsHashed, i => {
      return {
        ...itemsHashed[i.itemID],
        ...i,
      }
    })

    // Add Tags and sort for consistency
    let itemsToBeUpdated = addTag(itemsMerged, 'verkocht2018')

    console.log('---before update---')
    // Upload items
    await updateItems(itemsToBeUpdated)

    respond({ status: 200, body: { message: 'succes' } })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
