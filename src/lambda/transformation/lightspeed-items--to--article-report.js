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
    soldItemsHashed[item.id] = {
      id: item.id,
      value: soldItemsHashed[item.id]
        ? parseFloat(soldItemsHashed[item.id].value) + parseFloat(item.value)
        : parseFloat(item.value),
      quantity: soldItemsHashed[item.id]
        ? parseFloat(soldItemsHashed[item.id].quantity) +
          parseFloat(item.quantity)
        : parseFloat(item.quantity),
      fields: itemsHashed[item.id],
    }
  })
  delete soldItemsHashed['0']

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
    }
  })

  return aRFixed
}
