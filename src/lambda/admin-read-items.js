import moment from 'moment'
import fs from 'fs'

import readItems from './api/lightspeed/read-items.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }

  try {
    // Get all items
    let items = await readItems()

    // Do stuff
    var json = JSON.stringify(items)
    fs.writeFile('./src/data/items.json', json, 'utf8', () => {
      console.log('-----finnally done-----')
    })

    respond({ status: 200, body: { message: 'succes' } })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
