import util from 'util'
import _ from 'lodash'

import getSalelines from '../models/sales/sold-items.js'
import createMergedItems from '../models/sales/merged-items.js'
import updateItems from './update-items.js'

export default async (sales, items) => {
  console.log('Merging data')
  // Get the sold items statistics and add them to the items themselves
  let saleslines = getSalelines(sales)

  // Merge saleslines with items and remove '0' because it cannot be updated
  items = createMergedItems(saleslines, items, {
    lightweight: false,
  })

  let itemShopID = '47939'
  console.log('Calulating reorderpoints')
  // items.splice(0, 1)
  // _.times(100, n => {
  //   console.log(
  //     util.inspect(items[n].ItemShops.ItemShop, { depth: null, colors: true })
  //   )
  // })

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

  console.log('Pushing reorderpoints')
}
