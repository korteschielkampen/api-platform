export default items => {
  items = _.map(items, item => {
    item.statistics.reorderpoint = Math.round(item.statistics.totalSold / 2)
    item.statistics.reorderpointValue =
      item.statistics.reorderpoint * item.statistics.totalStockValue
    return item
  })
  return items
}
