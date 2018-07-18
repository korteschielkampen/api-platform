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
        ...i,
        categoryID: itemsHashed[i.itemID].categoryID,
        description: itemsHashed[i.itemID].description,
        shiitee: 39423,
        statistics: {
          totalStock: parseInt(
            _.find(itemsHashed[i.itemID].ItemShops.ItemShop, {
              shopID: '1',
            }).qoh
          ),
          ...i.statistics,
        },
      }
    } else {
      return i
    }
  })
}
