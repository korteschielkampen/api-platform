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
    return item
  })
}
