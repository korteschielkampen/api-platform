import _ from 'lodash'

export default (items, soldItems) => {
  // Create searchable object from array
  var itemsHashed = {}
  items.forEach(i => {
    itemsHashed[i.itemID] = i
  })

  // Calculate value per article
  let soldItemsHashed = {}
  soldItems.forEach((item, key) => {
    soldItemsHashed[item.id] = {
      id: item.id,
      value: soldItemsHashed[item.id]
        ? parseFloat(soldItemsHashed[item.id].value) + parseFloat(item.value)
        : parseFloat(item.value),
      quantity: item.quantity,
    }
  })

  console.log(soldItemsHashed)

  let aR = {}
  let aRFixed = {}
  return aRFixed
}
