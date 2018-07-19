import util from 'util'
import _ from 'lodash'
import moment from 'moment'

import getSoldItems from '../models/item/sold-items.js'
import createMergedItems from '../models/item/merged-items.js'
import updateItems from './update-items.js'
import calculateReorderpoints from '../models/item/reorderpoints.js'

export default async (sales, items) => {
  console.log('Merging data')
  // Make sure to seperate sales in months
  let dates = {
    start: moment().subtract(6, 'months'),
    end: moment(),
  }
  let reorderSales = _.filter(sales, sale => {
    return moment(moment(sale.completeTime)).isBetween(dates.start, dates.end)
  })

  // Merge saleslines with items
  let reorderSoldItems = getSoldItems(reorderSales)
  let reorderItems = createMergedItems(reorderSoldItems, items, {
    lightweight: false,
  })

  // Setting reorderpoint to half
  console.log('Calulating reorderpoints')
  reorderItems = calculateReorderpoints(reorderItems)

  /*
  Okay. A lot further now. Many headaches are out of the way.
  - Faster datapulling
  - Good limit on dates
  - Much more consistent codebase
  - Easy triggering of functions (better layout and templating)

  But now the real feature. I need segmented sales again, this time by month.
  Previously day was done, mabey some code is reusable.

  1. Segment sales by month
  2. Segment stocklevels by month -> This is a hard one. Where do I get
     stocklevels by time? I don't think this is possible, at least not easily
     it will require significant investment.
  2. Calculate the amount of units sold in those periods
  3. Calculate the three reoderpoint candidates
  - Last month time 3 feels best
  - Three month avarage feels interesting too
  - Six month average as context
  4. Update reorder point to this
  5. Set stocklevel to match this value
  */

  console.log('Pushing reorderpoints')
  return reorderItems
}
