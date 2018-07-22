export default (saleStatsByItem, items, options) => {
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
