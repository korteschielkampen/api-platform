import fs from 'fs'

import updateReorderPoints from './actions/update-reorderpoints.js'
import updateData from './actions/update-data.js'
import readData from './actions/read-data.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }
  // Avoid errors when excecuting in Lambda
  if (!callback) {
    var callback = () => {}
  }

  try {
    console.time('Starting Reorder Algorithm')
    respond({ status: 201, body: { message: 'request received' } })

    // Read the data from static
    // let sales = JSON.parse(fs.readFileSync('./static/data/sales.json'))
    // let items = JSON.parse(fs.readFileSync('./static/data/items.json'))
    // let categories = JSON.parse(
    //   fs.readFileSync('./static/data/categories.json')
    // )

    console.time('Getting data from AWS')
    let { sales, items, categories } = await readData('all')

    debugger

    console.log('Start Reorder')
    await updateReorderPoints(sales, items, categories)

    console.timeEnd('reorder')
  } catch (err) {
    console.error(err)
    respond({ status: 422, body: err })
  }
}
