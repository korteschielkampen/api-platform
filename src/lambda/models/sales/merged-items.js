import _ from 'lodash'

export default (soldItems, items, options) => {
  let itemsHashed = {}
  items.forEach(i => {
    itemsHashed[i.itemID] = i
  })

  return _.map(soldItems, i => {
    if (itemsHashed[i.itemID] && options.lightweight === false) {
      return {
        ...itemsHashed[i.itemID],
        ...i,
      }
    } else if (itemsHashed[i.itemID] && options.lightweight === true) {
      return {
        categoryID: itemsHashed[i.itemID].categoryID,
        description: itemsHashed[i.itemID].description,
        ...i,
      }
    } else {
      return i
    }
  })
}
