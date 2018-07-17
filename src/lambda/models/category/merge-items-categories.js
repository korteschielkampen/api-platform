export default (items, categories) => {
  // Preparing the categories to avoid checks and nasty errors
  categories = _.map(categories, c => {
    return {
      ...c,
      statistics: {
        totalSold: 0,
        totalRevenue: 0,
      },
      statisticsNested: {
        totalSold: 0,
        totalRevenue: 0,
      },
      children: [],
      items: {},
    }
  })

  _.forEach(items, i => {
    let key
    if (
      i.itemID !== '0' &&
      i.categoryID !== '0' &&
      i.categoryID !== undefined
    ) {
      key = _.findKey(categories, { categoryID: i.categoryID })
    } else if (i.itemID === '0') {
      key = _.findKey(categories, {
        categoryID: 'special-misc',
      })
    } else if (i.categoryID === '0') {
      key = _.findKey(categories, {
        categoryID: 'special-uncategorised',
      })
    } else {
      key = _.findKey(categories, {
        categoryID: 'special-notfound',
      })
    }

    categories[key] = {
      ...categories[key],
      statistics: {
        totalSold:
          categories[key].statistics.totalSold + i.statistics.totalSold,
        totalRevenue:
          categories[key].statistics.totalRevenue + i.statistics.totalRevenue,
      },
      items: {
        ...categories[key].items,
        [i.itemID]: i,
      },
    }
  })

  return categories
}