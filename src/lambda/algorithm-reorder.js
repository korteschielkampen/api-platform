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
    console.log('Starting Reorder Algorithm')
    respond({ status: 201, body: { message: 'request received' } })

    console.time('Getting data from AWS')
    let { sales, items, categories } = await readData('all')

    console.log('Start Reorder')
    await updateReorderPoints(sales, items, categories)

    console.log('Reorder Done!')
  } catch (err) {
    console.error(err)
    respond({ status: 422, body: err })
  }
}
