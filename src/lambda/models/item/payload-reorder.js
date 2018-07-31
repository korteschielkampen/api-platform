import util from 'util'

export default items => {
  // create reorderpayloads
  let payloads = items.reduce((acc, i) => {
    let reorderOptionsField =
      i.CustomFieldValues &&
      i.CustomFieldValues.CustomFieldValue.find(c => {
        return c.customFieldID === '9'
      })

    if (i.statistics.totalReorderpoint > 0) {
      acc.push({
        itemID: i.itemID,
        payload: {
          ItemShops: {
            ItemShop: [
              {
                itemShopID: i.ItemShops.ItemShop.find(s => {
                  return s.shopID === '1'
                }).itemShopID,
                // qoh: i.statistics.totalReorderpoint,
                reorderPoint: i.statistics.totalReorderpoint,
                reorderLevel: Math.round(i.statistics.totalReorderpoint * 1.5),
              },
            ],
          },
          CustomFieldValues: {
            CustomFieldValue: [
              {
                customFieldID: '9',
                value: `${i.statistics.totalDuration} weken`,
              },
            ],
          },
        },
      })
    }
    return acc
  }, [])

  // Push reorderpayload to updateItems
  return payloads
}
