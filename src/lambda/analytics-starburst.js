import moment from 'moment'
import fs from 'fs'
import util from 'util'

import createStarburst from './actions/create-starburst.js'

exports.handler = async (event, context, callback) => {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      body: JSON.stringify({ body }),
    })
  }

  try {
    let sales = JSON.parse(fs.readFileSync('./static/data/sales.json'))
    let items = JSON.parse(fs.readFileSync('./static/data/items.json'))
    let categories = JSON.parse(
      fs.readFileSync('./static/data/categories.json')
    )

    let starburstData = createStarburst(sales, items, categories)

    // console.log(util.inspect(starburstData, { colors: true, depth: 3 }))
    // Storing the file locally, which is then pushed up to the live version
    // -> Need to build in S3 storage or a more permanent solution.
    // -> Might be interesting to build my own GraphQL Apollo endpoint.
    var json = JSON.stringify({ body: { data: starburstData } })
    fs.writeFileSync('./static/data/sunburst.json', json)

    respond({
      status: 200,
      body: { message: 'succes', data: starburstData },
    })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
