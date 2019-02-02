const statistics = () => {
  return {
    totalSold: 0,
    totalRevenue: 0,
    totalProfit: 0,
    totalStock: 0,
    totalStockValue: 0,
    totalDuration: 0,
    totalReorderpoint: 0,
    totalReorderpointValue: 0,
  }
}

export default (items, categories) => {
  // Preparing the categories to avoid checks and nasty errors
  categories = _.map(categories, c => {
    return {
      ...c,
      statistics: statistics(),
      statisticsNested: statistics(),
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
      console.log(i)
      key = _.findKey(categories, {
        categoryID: 'special-notfound',
      })
    }

    categories[key].items = {
      ...categories[key].items,
      [i.itemID]: i,
    }
    _.forEach(categories[key].statistics, (statValue, statName) => {
      categories[key].statistics[statName] =
        categories[key].statistics[statName] + (i.statistics[statName] || 0)
    })
  })

  return categories
}
