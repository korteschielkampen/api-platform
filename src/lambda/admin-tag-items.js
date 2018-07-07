import moment from 'moment'
import fs from 'fs'
import _ from 'lodash'
import util from 'util'
import { asyncify, map, mapLimit } from 'async'
import { promisify } from 'util'
const pmap = promisify(map)
const pmapLimit = promisify(mapLimit)
const delay = require('delay')

import readSales from './api/lightspeed/read-sales.js'
import readItems from './api/lightspeed/read-items.js'
import updateItems from './api/lightspeed/update-items.js'
import createSoldItems from './transformation/lightspeed-sales--to--sold-items.js'

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

    // Add Tags
    let newTag = 'verkocht2018'
    let itemsToBeUpdated = []
    _.forEach(itemsMerged, item => {
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

    itemsToBeUpdated = _.sortBy(itemsToBeUpdated, ['itemID'])

    // Upload tags to Lightspeed
    const uploadItem = async (item, key) => {
      console.log('Item Start: ', item.itemID)
      let res = await updateItems(item.itemID, item.payload)
      let json = await res.json()

      let lsbucket = res.headers
        .get('x-ls-api-bucket-level')
        .split('/')
        .map(item => {
          return parseFloat(item)
        })
      let lsdrip = parseFloat(res.headers.get('x-ls-api-drip-rate'))
      let lscost = 10000 / lsdrip
      let lsdelay = (lsbucket[0] + 30) / lsbucket[1] * lscost
      console.log(
        'Item Done:',
        await json.Item.itemID,
        'LSBucket:',
        lsbucket[0].toFixed(2),
        lsbucket[1].toFixed(2),
        'LSRate:',
        lsdrip.toFixed(2),
        'Proposed Delay:',
        lsdelay.toFixed(2)
      )
      await delay(lsdelay)
    }

    // Update a array of items
    let uploadedItems = await pmapLimit(
      itemsToBeUpdated,
      1,
      asyncify(uploadItem)
    )

    // Update a specific item
    // let testItem = _.find(itemsToBeUpdated, { itemID: '17226' })
    // let res = await updateItems(testItem.itemID, testItem.payload)

    respond({ status: 200, body: { message: 'succes' } })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
