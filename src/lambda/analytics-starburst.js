import moment from 'moment'
import fs from 'fs'

import createSoldItems from './models/sales/sold-items.js'
import createMergedItems from './models/sales/merged-items.js'
import createWeightedCategoryReport from './models/category/starburst.js'

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

    let soldItems = createMergedItems(createSoldItems(sales), items, {
      lightweight: true,
    })
    let nestedCategories = createWeightedCategoryReport(soldItems, categories)

    var json = JSON.stringify({ body: { data: nestedCategories } })
    fs.writeFileSync('./static/data/sunburst.json', json)

    respond({
      status: 200,
      body: { message: 'succes', data: nestedCategories },
    })
  } catch (err) {
    console.log(err)
    respond({ status: 422, body: err })
  }
}
