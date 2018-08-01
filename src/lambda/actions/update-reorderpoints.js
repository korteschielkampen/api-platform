import createStockStatistics from './create-stock-statistics.js'
import createReorderPayload from '../models/item/payload-reorder.js'
import updateItems from './update-items.js'

export default async (sales, items, categories) => {
  console.log('Generate Stock Statistics')
  let itemsStockStatistics = await createStockStatistics(
    sales,
    items,
    categories
  )

  console.log('Generate Payloads')
  let payloads = createReorderPayload(itemsStockStatistics)

  console.log(
    `Updating Lightspeed: there are ${payloads.length} items to be updated`
  )
  let status = await updateItems(payloads)

  console.log('Done')
  return true
}
