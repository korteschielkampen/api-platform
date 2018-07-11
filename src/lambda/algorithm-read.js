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
    console.log('-----sales start-----')
    let sales = await readSales()
    let json = JSON.stringify(sales)
    fs.writeFile('./static/data/sales.json', json, 'utf8', () => {
      console.log('-----sales finnally done-----')
    })

    console.log('-----items start-----')
    let items = await readItems()
    json = JSON.stringify(items)
    fs.writeFile('./static/data/items.json', json, 'utf8', () => {
      console.log('-----items finnally done-----')
    })

    console.log('-----categories start-----')
    let categories = await readCategories()
    json = JSON.stringify(categories)
    fs.writeFile('./static/data/categories.json', json, 'utf8', () => {
      console.log('-----categories finnally done-----')
    })

    respond({ status: 200, body: { message: 'succes' } })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
