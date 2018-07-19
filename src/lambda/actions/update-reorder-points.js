import util from 'util'
import _ from 'lodash'
import moment from 'moment'

import getSoldItems from '../models/item/sold-items.js'
import createMergedItems from '../models/item/merged-items.js'
import updateItems from './update-items.js'

export default async (sales, items) => {
  console.log('Merging data')
  // Make sure to seperate sales in months
  let dates = {
    start: moment().subtract(6, 'months'),
    end: moment(),
  }
  let months = _.times(
    Math.ceil(
      moment.duration(moment(dates.end).diff(dates.start)).as('months')
    ),
    i => {
      let date = moment(dates.end)
        .subtract(i, 'months')
        .format()
      return {
        date: date,
        sales: _.filter(sales, sale => {
          return moment(date).isSame(moment(sale.completeTime), 'month')
        }),
      }
    }
  )

  // Lets get some statistics going
  let itemMonths = _.map(months, (month, key) => {
    // Get the sold items statistics and add them to the items themselves
    month.soldItems = getSoldItems(month.sales)
    // Merge saleslines with items
    month.items = createMergedItems(month.soldItems, items, {
      lightweight: false,
    })
    month.statistics = {
      totalSold: _.reduce(
        month.items,
        (result, item) => {
          return result + item.statistics.totalSold
        },
        0
      ),
    }
    return month
  })

  console.log(util.inspect(itemMonths, { depth: 1, colors: true }))

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
}
