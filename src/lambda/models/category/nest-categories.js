import util from 'util'

export default categories => {
  // This algorithm is dependant on sorting the array from the deepest level
  // to rootcategory. It nests the upper parts of the array in the lower parts,
  // with mutation of the array.
  categories = _.sortBy(categories, 'nodeDepth').reverse()

  // Duplicating the statistics to seperate nested values from own values. It
  // makes sense to display the accumated values, not the own values. While the
  // visualisationcode prefers the first.
  categories = _.map(categories, c => {
    return {
      ...c,
      statisticsNested: Object.assign(c.statistics),
    }
  })
  // console.log(util.inspect(categories, { colors: true, maxArrayLength: 1000 }))

  _.forEach(categories, c => {
    // Nesting of child in parent, taking note of previous element present
    let parentKey = _.findKey(categories, { categoryID: c.parentID })

    // If not the root
    if (c.nodeDepth > -1) {
      c.children = [
        ...c.children,
        // Adding values to make items more like categories, allowing them to be
        // visualized in the same place. Also a good place to reduce the datasize
        ..._.map(c.items, i => {
          i.name = i.description
          i.color = c.color
          return i
        }),
      ]

      // Empty items, because it's not needed anymore and would increase dataload
      c.items = {}
      categories[parentKey].children = [...categories[parentKey].children, c]

      // Do accumation of category statistics to display totals, now only own values.
      // -> Might not be needed though, as the client needs to calucalate this anyways.
      console.log(
        categories[parentKey].statisticsNested.totalStock,
        c.statisticsNested.totalStock,
        categories[parentKey].statisticsNested.totalStock +
          c.statisticsNested.totalStock
      )
      categories[parentKey].statisticsNested = {
        totalSold:
          categories[parentKey].statisticsNested.totalSold +
          c.statisticsNested.totalSold,
        totalRevenue:
          categories[parentKey].statisticsNested.totalRevenue +
          c.statisticsNested.totalRevenue,
        totalStock:
          categories[parentKey].statisticsNested.totalStock +
          c.statisticsNested.totalStock,
      }
    }
  })

  // Return only the root category, which now holds all the nested categories
  return _.find(categories, { nodeDepth: '-1' })
}
