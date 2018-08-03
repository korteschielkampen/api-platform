import createStockStatistics from './create-stock-statistics.js'
import createReorderPayload from '../models/item/payload-reorder.js'
import updateItems from './update-items.js'

// Small function to make ranges
const range = (start, end) => {
  let length = end - start + 1
  return Array.from({ length: length }, (_, i) => i).reduce((acc, i) => {
    acc[i + start] = true
    return acc
  }, {})
}

// exclusion categories:
const excludedCategories = {
  ...range(50, 87), // '102': Planten 50
  ...range(32, 39), // '110': Planten 32
  ...range(246, 263), // '170': Levend Aas
  ...range(308, 309), // '154': Visvergunning
}

export default async (sales, items, categories) => {
  console.log('Generate Stock Statistics')
  let itemsStockStatistics = await createStockStatistics(
    sales,
    items,
    categories
  )

  console.log('Generate Payloads')
  let payloads = createReorderPayload(itemsStockStatistics)

  // Filter problematic Items

  // Remove non-default items
  payloads = payloads.filter(i => {
    return (
      i.data.itemType === 'default' &&
      i.data.itemID !== '0' &&
      (i.data.Category ? !excludedCategories[i.data.Category.leftNode] : true)
    )
  })

  console.log(
    `Updating Lightspeed: there are ${payloads.length} items to be updated`
  )
  // let status = await updateItems(payloads)

  console.log('Done')
  return true
}
