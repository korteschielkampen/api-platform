import moment from 'moment'
import fs from 'fs'

import readSales from './api/lightspeed/read-sales.js'
import readItems from './api/lightspeed/read-items.js'
import readCategories from './api/lightspeed/read-categories.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }

  try {
    // Get all items
    let sales = await readSales()

    // Do stuff
    var json = JSON.stringify(sales)
    fs.writeFile('/data/sales.json', json, 'utf8', () => {
      console.log('-----finnally done-----')
    })

    let items = await readItems()

    // Do stuff
    var json = JSON.stringify(items)
    fs.writeFile('/data/items.json', json, 'utf8', () => {
      console.log('-----finnally done-----')
    })

    // Get all items
    let categories = await readCategories()

    // Do stuff
    var json = JSON.stringify(categories)
    fs.writeFile('/data/categories.json', json, 'utf8', () => {
      console.log('-----finnally done-----')
    })

    respond({ status: 200, body: { message: 'succes' } })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
