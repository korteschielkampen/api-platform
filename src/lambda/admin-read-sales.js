import moment from 'moment'
import fs from 'fs'

import readSales from './api/lightspeed/read-sales.js'

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
    fs.writeFile('./src/data/sales.json', json, 'utf8', () => {
      console.log('-----finnally done-----')
    })

    respond({ status: 200, body: { message: 'succes' } })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
