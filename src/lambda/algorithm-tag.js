import fs from 'fs'

import tagItems from './actions/tag-items.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }
  try {
    // Fire off confimation of event
    respond({ status: 201, body: { message: 'request received' } })

    // Read data from querystring
    let tag = event.queryStringParameters.tag

    // Read the data from static
    let sales = JSON.parse(fs.readFileSync('./static/data/sales.json'))
    let items = JSON.parse(fs.readFileSync('./static/data/items.json'))

    await tagItems(sales, items, tag)
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
