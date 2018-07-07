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
    let itemsToBeUpdated = _.map(itemsMerged, item => {
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

      return itemToBeUpdated
    })

    // console.log(util.inspect(itemsToBeUpdated, { colors: true, depth: 4 }))
    // let testItem = _.find(itemsToBeUpdated, { itemID: '16489' })
    //
    // let testItems = [
    //   {
    //     itemID: '36094',
    //     payload: {
    //       Tags: [
    //         { tag: 'detacomimport' },
    //         { tag: 'verkocht2018' },
    //         { tag: 'verkocht2018' },
    //       ],
    //     },
    //   },
    //   {
    //     itemID: '36095',
    //     payload: {
    //       Tags: [
    //         { tag: 'detacomimport' },
    //         { tag: 'verkocht2018' },
    //         { tag: 'testtag' },
    //       ],
    //     },
    //   },
    // ]

    // Upload tags to Lightspeed
    const uploadItem = async (item, key) => {
      console.log('start: ', item.itemID)
      let res = await updateItems(item.itemID, item.payload)
      console.log('done: ', res.itemID)

      // lowspeed = 1 a 10 sec
      // midspeed = 1 a 5 sec
      // highspeed = 1 a 3.5 sec
      await delay(10000)
    }

    let uploadedItems = await pmapLimit(
      itemsToBeUpdated,
      1,
      asyncify(uploadItem)
    )

    respond({ status: 200, body: { message: 'succes' } })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
