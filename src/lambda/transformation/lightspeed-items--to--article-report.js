import _ from 'lodash'

export default (items, soldItems) => {
  // Create searchable object from array
  var itemsHashed = {}
  items.forEach(i => {
    itemsHashed[i.itemID] = i
  })

  // Calculate value per article
  console.log(soldItems)

  let aR = {}
  let aRFixed = {}
  return aRFixed
}
