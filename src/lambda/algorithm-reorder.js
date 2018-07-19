import fs from 'fs'

import updateReorderPoints from './actions/update-reorder-points.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }
  try {
    respond({ status: 201, body: { message: 'request received' } })
    // Read the data from static
    let sales = JSON.parse(fs.readFileSync('./static/data/sales.json'))
    let items = JSON.parse(fs.readFileSync('./static/data/items.json'))
    let categories = JSON.parse(
      fs.readFileSync('./static/data/categories.json')
    )
    await updateReorderPoints(sales, items, categories)
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
