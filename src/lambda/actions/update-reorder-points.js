import util from 'util'
import _ from 'lodash'

import getSoldItems from '../models/item/sold-items.js'
import createMergedItems from '../models/item/merged-items.js'
import updateItems from './update-items.js'

export default async (sales, items) => {
  console.log('Merging data')
  // Get the sold items statistics and add them to the items themselves
  let soldItems = getSoldItems(sales)

  // Merge saleslines with items and remove '0' because it cannot be updated
  items = createMergedItems(soldItems, items, {
    lightweight: false,
  })

  let itemShopID = '47939'
  console.log('Calulating reorderpoints')

  /*

  Okay. A lot further now. Many headaches are out of the way.
  - Faster datapulling
  - Good limit on dates
  - Much more consistent codebase
  - Easy triggering of functions (better layout and templating)

  But now the real feature. I need segmented sales again, this time by month.
  Previously day was done, mabey some code is reusable.

  1. Segment sales by month
  2. Calculate the amount of units sold in those periods
  3. Calculate the three reoderpoint candidates
  - Last month time 3 feels best
  - Three month avarage feels interesting too
  - Six month average as context
  4. Update reorder point to this
  5. Set stocklevel to match this value


  */

  console.log('Pushing reorderpoints')
}
