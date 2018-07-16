import getSalelines from '../models/sales/sold-items.js'
import createMergedItems from '../models/sales/merged-items.js'
import updateItems from './update-items.js'

export default async (sales, items) => {
  console.log('Retrieving and merging data')
  // Get the sold items statistics and add them to the items themselves
  let saleslines = getSalelines(sales)

  // Merge saleslines with items and remove '0' because it cannot be updated
  items = createMergedItems(saleslines, items, {
    lightweight: false,
  })

  console.log('Calulating reorderpoints')
  /*

  Sooooo I've got 3500 items here. What now? How to calculate three months of stock?
  Firstoff, lets be clear where the "verkocht 2018" tag starts and ends. It's also
  leaning on december 2017, it simply get all sales. Besides that, talking to
  the salesline API could be nicer to avoid headaches. A sale does not have
  itemID's a saleline might just have that. Which will be benificial in the future.
  if I want to update data more acurrately.

  1. Rebuild "solditems" from the salesline API
  2. Get a 3 month avarage from yearly stats. Test which number works best
    - Last month time 3 feels best
    - Six month average as context
  3. Update reorder point to this


  */

  // Create tag payload from original tags and the new one
  // Send the tags away
  // await updateItems(itemPayloads)
}
