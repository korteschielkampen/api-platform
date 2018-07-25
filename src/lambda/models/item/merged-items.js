export default (saleStatsByItem, items, options) => {
  // Making a dictionairy (not expanding with spread and literal 'cuz perf)
  let itemsHashed = items.reduce((acc, i) => {
    acc[i.itemID] = i
    return acc
  }, {})

  // Do the actual merging by reduce, but use the dictionary for quick search
  let mergedItems = saleStatsByItem.reduce((acc, i) => {
    acc.push({
      ...itemsHashed[i.itemID],
      ...i,
    })
    return acc
  }, [])
  return mergedItems
}
