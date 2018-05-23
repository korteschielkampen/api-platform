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
    if (item.id != 0) {
      soldItemsHashed[item.id] = {
        id: item.id,
        value: soldItemsHashed[item.id]
          ? parseFloat(soldItemsHashed[item.id].value) + parseFloat(item.value)
          : parseFloat(item.value),
        quantity: soldItemsHashed[item.id]
          ? parseFloat(soldItemsHashed[item.id].quantity) +
            parseFloat(item.quantity)
          : parseFloat(item.quantity),
        profit: soldItemsHashed[item.id]
          ? soldItemsHashed[item.id].profit +
            (item.value -
              item.quantity * parseInt(itemsHashed[item.id].avgCost))
          : item.value - item.quantity * parseInt(itemsHashed[item.id].avgCost),
        profitPercentage:
          (item.value -
            item.quantity * parseInt(itemsHashed[item.id].avgCost)) /
          item.value *
          100,
        fields: itemsHashed[item.id],
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
      value: item.value.toFixed(0),
      quantity: item.quantity.toFixed(0),
      profit: item.profit.toFixed(0),
      profitPercentage: item.profitPercentage.toFixed(0),
    }
  })

  return aRFixed
}
