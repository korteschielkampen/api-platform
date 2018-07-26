import util from 'util'

export default categories => {
  // This algorithm is dependant on sorting the array from the deepest level
  // to rootcategory. It nests the upper parts of the array in the lower parts,
  // with mutation of the array.
  categories = _.sortBy(categories, 'nodeDepth').reverse()

  // Duplicating the statistics to seperate nested values from own values. It
  // makes sense to display the accumated values, not the own values.
  categories = _.map(categories, c => {
    return {
      ...c,
      statisticsNested: { ...c.statistics },
    }
  })

  _.forEach(categories, c => {
    // Nesting of child in parent, taking note of previous element present
    let parentKey = _.findKey(categories, { categoryID: c.parentID })

    // If not the root
    if (c.nodeDepth > -1) {
      c.children = [
        ...c.children,
        // Adding values to make items more like categories, allowing them to be
        // visualized without to many conditionals.
        ..._.map(c.items, i => {
          i.name = i.description
          i.color = c.color
          return i
        }),
      ]

      // Empty items, because it's not needed anymore and would increase dataload
      c.items = {}
      categories[parentKey].children = [...categories[parentKey].children, c]

      // Calculate accumulated values
      _.forEach(
        categories[parentKey].statisticsNested,
        (statValue, statName) => {
          categories[parentKey].statisticsNested[statName] =
            categories[parentKey].statisticsNested[statName] +
            c.statisticsNested[statName]
        }
      )
    }
  })

  // Return only the root category, which now holds all the nested categories
  let rootCategory = _.find(categories, { nodeDepth: '-1' })

  const durationCorrection = element => {
    if (!element.itemID) {
      debugger
      let sellingSpeedInWeeks = element.statisticsNested.totalSold / 26
      element.statisticsNested.totalDuration = Math.floor(
        element.statisticsNested.totalStock / sellingSpeedInWeeks
      )
      element.children.forEach(durationCorrection)
    }
  }
  durationCorrection(rootCategory)

  return rootCategory
}
