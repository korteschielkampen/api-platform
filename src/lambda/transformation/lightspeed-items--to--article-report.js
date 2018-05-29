import _ from 'lodash'

export default (items, soldItems) => {
  // Create searchable object from array
  var itemsHashed = {}
  items.forEach(i => {
    itemsHashed[i.itemID] = i
  })

  // Calculate value per article and attach item
  let soldItemsHashed = {}
  soldItems.forEach((item, key) => {
    if (item.id != 0 && itemsHashed[item.id]) {
      let totalCost = item.quantity * parseFloat(itemsHashed[item.id].avgCost)

      soldItemsHashed[item.id] = {
        id: item.id,
        value: soldItemsHashed[item.id]
          ? parseFloat(soldItemsHashed[item.id].value) + parseFloat(item.value)
          : parseFloat(item.value),
        totalCost: soldItemsHashed[item.id]
          ? soldItemsHashed[item.id].totalCost + totalCost
          : totalCost,
        quantity: soldItemsHashed[item.id]
          ? parseFloat(soldItemsHashed[item.id].quantity) +
            parseFloat(item.quantity)
          : parseFloat(item.quantity),
        fields: itemsHashed[item.id],
        profit: soldItemsHashed[item.id]
          ? soldItemsHashed[item.id].profit + item.value - totalCost
          : item.value - totalCost,
        profitPercentage: (item.value - totalCost) / totalCost * 100,
      }
    }
  })

  let deleteItemOnTag = (tag, itemKey) => {
    if (tag == 'no-report') {
      delete soldItemsHashed[itemKey] // Diversen
    }
  }

  // Delete items
  Object.entries(soldItemsHashed).map(([itemKey, item]) => {
    if (item.fields.Tags && item.fields.Tags.tag) {
      if (typeof item.fields.Tags.tag == 'string') {
        deleteItemOnTag(item.fields.Tags.tag, itemKey)
      } else if (typeof item.fields.Tags.tag == 'object') {
        item.fields.Tags.tag.map(tag => {
          deleteItemOnTag(tag, itemKey)
        })
      }
    }
  })

  // Convert back to array
  let soldItemsCounted = Object.values(soldItemsHashed)
  let aR = soldItemsCounted.sort((a, b) => {
    return b.value - a.value
  })

  let aRFixed = aR.map(item => {
    return {
      ...item,
      value: item.value.toFixed(2),
      quantity: item.quantity.toFixed(0),
      totalCost: item.totalCost.toFixed(2),
      profit: item.profit.toFixed(2),
      profitPercentage: item.profitPercentage.toFixed(2),
    }
  })
  return aRFixed
}
