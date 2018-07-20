import _ from 'lodash'

import guessCost from './guess-cost.js'
import getReorderPoint from './reorderpoints.js'

export default (soldItems, items, options) => {
  let itemsHashed = {}
  items.forEach(i => {
    itemsHashed[i.itemID] = i
  })

  items = _.map(soldItems, i => {
    if (itemsHashed[i.itemID]) {
      if (options.lightweight === false) {
        // return everything
        return {
          ...itemsHashed[i.itemID],
          ...i,
        }
      } else if (options.lightweight === true) {
        // Only return essential values
        return {
          ...i,
          categoryID: itemsHashed[i.itemID].categoryID,
          description: itemsHashed[i.itemID].description,
        }
      }
    } else {
      return i
    }
  })
  return items
}
