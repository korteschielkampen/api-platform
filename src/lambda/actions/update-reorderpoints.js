import createStockStatistics from './create-stock-statistics.js'
import createReorderPayload from '../models/item/payload-reorder.js'
import updateItems from './update-items.js'
import createMessage from '../api/slack/create-message.js'
import createStockReport from '../models/slack/report-stock/'

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
    `Updating Lightspeed: there are ${
      payloads.length
    } items to be updated, only 20 will be`
  )
  // let status = await updateItems(payloads.slice(0, 50))
  let status = await updateItems(payloads.slice(0, 20))

  console.log('Reporting to Slack')
  if (payloads.length !== 0) {
    await createMessage(createStockReport(payloads.slice(0, 20), 'CC596HWES'))
  }

  console.log('Reordering adjustments done')
  debugger
  return true
}
