import _ from 'lodash'

export default (saleStatsByItem, items, options) => {
  // Ive made it far worse that the previous JS implementation.
  // Fastest: Just write the forEach and merge the maps manually.
  // Most readable: Perform an reduce
  let lodash = _.map(
    _.merge(
      _.keyBy(_.intersection(items, saleStatsByItem, 'itemID'), 'itemID'),
      saleStatsByItem
    ),
    i => i
  )

  let mergedItems = items.reduce((acc, i) => {
    saleStatsByItem[i.itemID] &&
      acc.push({
        ...i,
        ...saleStatsByItem[i.itemID],
      })
    return acc
  }, [])
  return mergedItems
}
