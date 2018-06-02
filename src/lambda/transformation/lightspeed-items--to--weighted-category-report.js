import _ from 'lodash'
import merge from 'deepmerge'
import { scaleLinear } from 'd3-scale'
import { color } from 'd3-color'
const util = require('util')

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
    name: 'Totaal',
    categoryID: '0',
    nodeDepth: '-1',
    parentID: '-1',
    color: color('hsl(0, 0%, 90%)').hex(),
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

  // Setup colors
  let rootCategories = _.filter(categories, { nodeDepth: '0' })
  let vizcolors = [
    'hsl(151, 100%, 42%)',
    'hsl(42, 100%, 50%)',
    'hsl(204, 100%, 43%)',
  ]

  // 'hsl(15, 100%, 50%)',

  rootCategories = _.map(rootCategories, (rc, k) => {
    rc.colorRange = color(vizcolors[k])
    return rc
  })

  // Nesting the categories
  let sortedCategories = _.sortBy(categories, 'nodeDepth').reverse()
  _.forEach(sortedCategories, c => {
    // Assign color
    _.map(rootCategories, rc => {
      if (
        parseInt(rc.leftNode) <= parseInt(c.leftNode) &&
        parseInt(rc.rightNode) >= parseInt(c.rightNode)
      ) {
        let colorBrightness =
          (parseInt(c.leftNode) - parseInt(rc.leftNode)) /
          (parseInt(rc.rightNode) - parseInt(rc.leftNode))
        c.color = rc.colorRange.brighter(colorBrightness * 1.4).hex()
      }
    })

    // Do nesting
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

  // console.log(
  //   util.inspect(nestedCategories, {
  //     colors: true,
  //     depth: 2,
  //   })
  // )

  return nestedCategories[0]
}
