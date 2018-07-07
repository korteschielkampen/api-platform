import _ from 'lodash'
import merge from 'deepmerge'
import { scaleLinear } from 'd3-scale'
import { color } from 'd3-color'
const util = require('util')

export default (items, soldItems, categories) => {
  let itemsHashed = {}
  items.forEach(i => {
    itemsHashed[i.itemID] = i
  })

  let soldItemsHashed = {}
  soldItems.forEach(i => {
    if (soldItemsHashed[i.id]) {
      soldItemsHashed[i.id] = {
        itemID: i.id,
        statistics: {
          totalSold: soldItemsHashed[i.id].statistics.totalSold + i.quantity,
          totalRevenue: soldItemsHashed[i.id].statistics.totalRevenue + i.value,
          valueWithTax:
            soldItemsHashed[i.id].statistics.valueWithTax + i.valueWithTax,
        },
      }
    } else {
      soldItemsHashed[i.id] = {
        itemID: i.id,
        statistics: {
          totalSold: i.quantity,
          totalRevenue: i.value,
          valueWithTax: i.valueWithTax,
        },
      }
    }
  })

  let itemsMerged = _.map(soldItemsHashed, i => {
    // Setting up item id for merge
    return {
      // ...itemsHashed[i.itemID],
      categoryID: itemsHashed[i.itemID]
        ? itemsHashed[i.itemID].categoryID
        : undefined,
      description: itemsHashed[i.itemID]
        ? itemsHashed[i.itemID].description
        : undefined,
      ...i,
    }
  })

  // Setting up flare
  categories.push({
    name: 'Totaal',
    categoryID: '0',
    nodeDepth: '-1',
    parentID: '-1',
    color: color('hsl(0, 0%, 90%)').hex(),
  })

  // Setting up special categories
  categories.push({
    name: 'Speciale Categorieën',
    categoryID: '564783984726582904875634528',
    nodeDepth: '0',
    parentID: '0',
    color: color('hsl(0, 0%, 80%)').hex(),
  })
  categories.push({
    name: 'Ongecategoriseerd',
    categoryID: '5647839847265829048756345287349563495768943075',
    nodeDepth: '1',
    parentID: '564783984726582904875634528',
    color: color('hsl(0, 0%, 70%)').hex(),
  })
  categories.push({
    name: 'Diversen',
    categoryID: '56478398472658290487563452882634782364',
    nodeDepth: '1',
    parentID: '564783984726582904875634528',
    color: color('hsl(0, 0%, 60%)').hex(),
  })
  categories.push({
    name: 'Onbekend',
    categoryID: '5647839847265829048756345288263478236492873489',
    nodeDepth: '1',
    parentID: '564783984726582904875634528',
    color: color('hsl(0, 0%, 50%)').hex(),
  })

  // Preparing the categories to avoid checks
  categories = _.map(categories, c => {
    return {
      ...c,
      statistics: {
        totalSold: 0,
        totalRevenue: 0,
      },
      statisticsCat: {
        totalSold: 0,
        totalRevenue: 0,
      },
      statisticsSub: {
        totalSold: 0,
        totalRevenue: 0,
      },
      children: [],
      items: {},
    }
  })

  // Weighting the categories
  _.forEach(itemsMerged, i => {
    let key
    if (
      i.itemID !== '0' &&
      i.categoryID !== '0' &&
      i.categoryID !== undefined
    ) {
      key = _.findKey(categories, { categoryID: i.categoryID })
    } else if (i.itemID === '0') {
      key = _.findKey(categories, {
        categoryID: '56478398472658290487563452882634782364',
      })
    } else if (i.categoryID === '0') {
      key = _.findKey(categories, {
        categoryID: '5647839847265829048756345287349563495768943075',
      })
    } else {
      key = _.findKey(categories, {
        categoryID: '5647839847265829048756345288263478236492873489',
      })
    }

    categories[key].statisticsCat = {
      totalSold:
        categories[key].statisticsCat.totalSold + i.statistics.totalSold,
      totalRevenue:
        categories[key].statisticsCat.totalRevenue + i.statistics.totalRevenue,
    }

    categories[key].items = {
      ...categories[key].items,
      [i.itemID]: i,
    }
  })

  // Setup colors and rootCategories
  let vizcolors = [
    'hsl(151, 100%, 42%)',
    'hsl(42, 100%, 50%)',
    'hsl(204, 100%, 43%)',
    'hsl(0, 0%, 80%)',
  ]
  let rootCategories = _.map(
    _.filter(categories, { nodeDepth: '0' }),
    (rc, k) => {
      rc.colorRange = color(vizcolors[k])
      return rc
    }
  )

  categories = _.map(categories, c => {
    return {
      ...c,
      statisticsSub: Object.assign(c.statisticsCat),
    }
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
        c.color = rc.colorRange.brighter(colorBrightness * 1.6).hex()
      }
    })

    // Do nesting
    let parentKey = _.findKey(sortedCategories, { categoryID: c.parentID })
    if (c.parentID > -1) {
      c.children = [
        ...c.children,
        ..._.map(c.items, i => {
          i.name = i.description
          i.color = c.color
          return i
        }),
      ]
      c.items = {}
      sortedCategories[parentKey].children = [
        ...sortedCategories[parentKey].children,
        c,
      ]
      sortedCategories[parentKey].statisticsSub = {
        totalSold:
          sortedCategories[parentKey].statisticsSub.totalSold +
          c.statisticsSub.totalSold,
        totalRevenue:
          sortedCategories[parentKey].statisticsSub.totalRevenue +
          c.statisticsSub.totalRevenue,
      }
    }
  })

  let nestedCategories = _.filter(sortedCategories, { nodeDepth: '-1' })
  return nestedCategories[0]
}
