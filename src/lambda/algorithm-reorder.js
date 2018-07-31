import fs from 'fs'

import createStockStatistics from './actions/create-stock-statistics.js'
import updateReorderPoints from './actions/update-reorderpoints.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }
  if (!callback) {
    var callback = () => {}
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
    console.error(err)
    respond({ status: 422, body: err })
  }
}
