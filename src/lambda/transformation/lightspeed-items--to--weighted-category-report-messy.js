import _ from 'lodash'
import merge from 'deepmerge'
const util = require('util')
const fs = require('fs')

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
    // console.log(i.categoryID)
    if (i.categoryID !== '0' && i.categoryID !== undefined) {
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
        // items: {
        //   ...(weightedCategories[i.categoryID] &&
        //     weightedCategories[i.categoryID].items),
        //   [i.itemID]: i,
        // },
      }
    }
  })

  let mergefunction = (sum, n) => {}

  let report = _.reduce(weightedCategories, mergefunction, 0)

  //
  // let report = {}
  // let mergefunction = iterator => {
  //   report[names[0]] = mergefunction(rc, c)
  //   return {
  //     name: names[0],
  //     children: mergefunction(),
  //   }
  // }

  // _.forEach(weightedCategories, (c, i) => {
  //   let names = c.fullPathName.split('/')
  //   report[names[0]] = mergefunction(report[names[0]], c)
  //   report[names[0]][names[1]] = mergefunction(report[names[0]][names[1]], c)
  //   report[names[0]][names[1]][names[2]] = mergefunction(
  //     report[names[0]][names[1]][names[2]],
  //     c
  //   )
  //   report[names[0]][names[1]][names[2]][names[3]] = mergefunction(
  //     report[names[0]][names[1]][names[2]][names[3]],
  //     c
  //   )
  // })

  // let unmergedNestedCategories = _.map(weightedCategories, c => {
  //   if (c.categoryID) {
  //     let names = c.fullPathName.split('/')
  //     let length = names.length
  //     let result = {}
  //     _.times(length, key => {
  //       let inversekey = length - (key + 1)
  //       result = {
  //         name: names[inversekey],
  //         statistics: c.statistics,
  //         ...(!_.isEmpty(result) && { children: [result] }),
  //       }
  //     })
  //     return result
  //   }
  // })
  //
  // let nestedCategories = _.map(weightedCategories, nc => {
  //
  // }

  // console.log(unmergedNestedCategories)
  // fs.writeFileSync('test.json', JSON.stringify(unmergedNestedCategories))

  // let sortedCategories = _.sortBy(weightedCategories, 'nodeDepth').reverse()
  //
  // _.forEach(sortedCategories, c => {
  //   let parentIndex = _.findIndex(sortedCategories, {
  //     categoryID: c.parentID,
  //   })
  //
  //   // console.log(parentIndex, c.parentID, c.fullPathName, c)
  //   // sortedCategories[parentIndex].children = [
  //   //   ...((sortedCategories.children && sortedCategories.children) || []),
  //   //   c,
  //   // ]
  //   // sortedCategories[parentIndex].statistics = {
  //   //   ...sortedCategories.statistics,
  //   //   statistics: {
  //   //     totalSold:
  //   //       (weightedCategories[i.categoryID] &&
  //   //         weightedCategories[i.categoryID].statistics.totalSold +
  //   //           i.statistics.totalSold) ||
  //   //       i.statistics.totalSold,
  //   //     totalRevenue:
  //   //       (weightedCategories[i.categoryID] &&
  //   //         weightedCategories[i.categoryID].statistics.totalRevenue +
  //   //           i.statistics.totalRevenue) ||
  //   //       i.statistics.totalRevenue,
  //   //   },
  //   // }
  // })

  //   fs.writeFileSync('test.json', JSON.stringify(weightedCategories))
  //   //
  //   let revenue = 0
  //   _.map(weightedCategories, c => {
  //     revenue += c.statistics.totalRevenue
  //   })
  //   console.log(revenue)
  //   // Target datastructure
  //   // {
  //   //   "name": "flare",
  //   //   "children": [
  //   //     {
  //   //       "name": "analytics",
  //   //       "children": [
  //
  //   // Nesting the categories
  //
  //   /*
  //   1. Sort on basis of nodedepth --> returns array of objects
  //   2. Map over array and object to add them to the higher node.
  //   3. Done.
  //   */
  //

  //
  //   // console.log(sortedCategories)
  //
  //   // const createNestedCategory = (current, parent) => {
  //   //   if (parent && parent.parentID !== '0') {
  //   //     let result = {
  //   //       [current.parentID]: {
  //   //         ...parent,
  //   //         children: {
  //   //           [current.categoryID]: current,
  //   //         },
  //   //       },
  //   //     }
  //   //     return createNestedCategory(result, weightedCategories[parent.parentID])
  //   //   } else {
  //   //     return current
  //   //   }
  //   // }
  //   //
  //   // let nestedCategories = {}
  //   // _.forEach(weightedCategories, category => {
  //   //   if (category.categoryID) {
  //   //     let result = createNestedCategory(
  //   //       category,
  //   //       weightedCategories[category.parentID]
  //   //     )
  //   //     // console.log(result)
  //   //     // nestedCategories = merge(nestedCategories, result)
  //   //     // console.log(util.inspect(result, { depth: 5, color: true }))
  //   //   }
  //   // })
  //
  //   // const overwriteMerge = (destinationArray, sourceArray, options) => {
  //   //
  //   //   return sourceArray
  //   // }
  //   //
  //   let nestedCategories = []
  //   _.forEach(weightedCategories, category => {
  //     if (category.categoryID) {
  //       let names = category.fullPathName.split('/')
  //       let length = names.length
  //       let result = {}
  //       _.times(length, key => {
  //         let inversekey = length - (key + 1)
  //         result = {
  //           ...category,
  //           children: [result],
  //         }
  //       })
  //       nestedCategories = merge(nestedCategories, result, {
  //         arrayMerge: overwriteMerge,
  //       })
  //     }
  //   })
  //
  //   // console.log(
  //   //   util.inspect(nestedCategories, {
  //   //     depth: 1,
  //   //     colors: true,
  //   //   })
  //   // )
}
