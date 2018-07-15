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
    // Up front because takes to long
    respond({
      status: 200,
      body: { message: 'request received' },
    })

    console.log('-----start-----')
    let sales = readSales()
    let items = readItems()
    let categories = readCategories()

    let salesData = JSON.stringify(await sales)
    fs.writeFile('./static/data/sales.json', salesData, 'utf8', () => {
      console.log('-----sales finnally done-----')
    })
    let itemsData = JSON.stringify(await items)
    fs.writeFile('./static/data/items.json', itemsData, 'utf8', () => {
      console.log('-----items finnally done-----')
    })
    let categoriesData = JSON.stringify(await categories)
    fs.writeFile(
      './static/data/categories.json',
      categoriesData,
      'utf8',
      () => {
        console.log('-----categories finnally done-----')
      }
    )
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
