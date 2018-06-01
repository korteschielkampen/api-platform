import _ from 'lodash'
import merge from 'deepmerge'
const util = require('util')

export default (items, soldItems) => {
  // Merge sold items and items on key, but create objects first.
  let itemsHashed = {}
  items.forEach(i => {
    itemsHashed[i.itemID] = i
  })

  let soldItemsHashed = {}
  soldItems.forEach(i => {
    soldItemsHashed[i.id] = {
      itemID: i.id,
      statistics: {
        totalSold: parseFloat(i.quantity),
        totalRevenue: i.value,
      },
    }
  })

  let itemsMerged = merge(itemsHashed, soldItemsHashed)
  let itemsRevenue = _.filter(itemsMerged, item => {
    return item.statistics && item
  })

  // Weighting the categories
  let weightedCategories = {}
  _.forEach(itemsRevenue, i => {
    weightedCategories[i.categoryID] = {
      ...i.Category,
      statistics: {
        totalSold:
          (weightedCategories[i.categoryID] &&
            weightedCategories[i.categoryID].statistics.totalSold +
              i.statistics.totalSold) ||
          i.statistics.totalSold,
        totalRevenue:
          (weightedCategories[i.categoryID] &&
            weightedCategories[i.categoryID].statistics.totalRevenue +
              i.statistics.totalRevenue) ||
          i.statistics.totalRevenue,
      },
      items: {
        ...(weightedCategories[i.categoryID] &&
          weightedCategories[i.categoryID].items),
        [i.itemID]: i,
      },
    }
  })

  console.log(weightedCategories)

  // Nesting the categories
  let nestedCategories = {}
  _.forEach(itemsRevenue, item => {
    if (item.Category) {
      let names = item.Category.fullPathName.split('/')
      let length = names.length
      let result = {}
      _.times(length, key => {
        let inversekey = length - (key + 1)
        result = {
          [names[inversekey]]: {
            ...item.Category,
            children: {
              ...result,
            },
            statistics: {
              totalRevenue: item.statistics.totalRevenue,
              totalSold: item.statistics.totalRevenue,
            },
          },
        }
      })
      nestedCategories = merge(weightedCategories, result)
    }
  })
  // console.log(util.inspect(weightedCategories, false, null))
}
