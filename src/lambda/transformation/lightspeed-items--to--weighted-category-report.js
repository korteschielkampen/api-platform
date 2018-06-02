import _ from 'lodash'
import merge from 'deepmerge'
const util = require('util')
const fs = require('fs')

export default (items, soldItems, categories) => {
  // Merge sold items and items and filter useless
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

  categories.push({
    name: 'flare',
    categoryID: '0',
    nodeDepth: '-1',
    parentID: '-1',
  })

  // Preparing the categories to avoid checks
  categories = _.map(categories, c => {
    return {
      ...c,
      statistics: {
        totalSold: 0,
        totalRevenue: 0,
      },
      children: [],
      items: {},
    }
  })

  // Weighting the categories
  _.forEach(itemsRevenue, i => {
    if (i.categoryID !== '0' && i.categoryID !== undefined) {
      let key = _.findKey(categories, { categoryID: i.categoryID })
      categories[key].statistics = {
        totalSold:
          categories[key].statistics.totalSold + i.statistics.totalSold,
        totalRevenue:
          categories[key].statistics.totalRevenue + i.statistics.totalRevenue,
      }
      // categories[key].items = {
      //   ...categories[key].items,
      //   [i.itemID]: i,
      // }
    }
  })

  // Nesting the categories
  let sortedCategories = _.sortBy(categories, 'nodeDepth').reverse()
  _.forEach(sortedCategories, c => {
    let parentKey = _.findKey(sortedCategories, { categoryID: c.parentID })
    if (c.parentID > '-1') {
      sortedCategories[parentKey].children = [
        ...sortedCategories[parentKey].children,
        c,
      ]
      sortedCategories[parentKey].statistics = {
        totalSold:
          sortedCategories[parentKey].statistics.totalSold +
          c.statistics.totalSold,
        totalRevenue:
          sortedCategories[parentKey].statistics.totalRevenue +
          c.statistics.totalRevenue,
      }
    }
  })

  let nestedCategories = _.filter(sortedCategories, { nodeDepth: '-1' })

  console.log(
    util.inspect(nestedCategories, {
      colors: true,
      depth: 2,
    })
  )

  return nestedCategories[0]
}
