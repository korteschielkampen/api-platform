export default items => {
  return items.map(item => {
    // Sometimes object, sometimes array. Now always array.
    if (
      item.CustomFieldValues &&
      !Array.isArray(item.CustomFieldValues.CustomFieldValue)
    ) {
      item.CustomFieldValues.CustomFieldValue = [
        item.CustomFieldValues.CustomFieldValue,
      ]
    }

    if (item.ItemShops) {
      if (!Array.isArray(item.ItemShops.ItemShop)) {
        item.CustomFieldValues.CustomFieldValue = [
          item.CustomFieldValues.CustomFieldValue,
        ]
      }
      item.ItemShops.ItemShop = item.ItemShops.ItemShop.map(s => {
        s.qoh = parseInt(s.qoh)
        s.reorderPoint = parseInt(s.reorderPoint)
        s.reorderLevel = parseInt(s.reorderLevel)
        return s
      })
    }

    return item
  })
}
