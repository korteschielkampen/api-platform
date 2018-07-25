export default items => {
  items = items.map(item => {
    return {
      description: items.description,
      categoryID: items.categoryID,
      statistics: items.statistics,
    }
  })
  return items
}
