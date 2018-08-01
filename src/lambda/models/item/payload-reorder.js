import util from 'util'

export default items => {
  items.map(i => {
    if (i.ItemShops) {
      let shop = i.ItemShops.ItemShop.find(f => {
        return f.shopID === '1'
      })
      shop.qoh = parseInt(shop.qoh)
      shop.reorderPoint = parseInt(shop.reorderPoint)
      shop.reorderLevel = parseInt(shop.reorderLevel)
    }
  })

  // create reorderpayloads
  let payloads = items.reduce((acc, i) => {
    // Quit here if no itemshops, doesnt make sense to even continue
    if (!i.ItemShops) {
      return acc
    }

    // Prepare for diff, to speed up the process immensely, writing is horribly
    // expensive. If these values differ, update. Also makes total database
    // updates more bearable.
    let currentItemShop = i.ItemShops.ItemShop.find(s => {
      return s.shopID === '1'
    })

    let oldCustomField =
      i.CustomFieldValues &&
      i.CustomFieldValues.CustomFieldValue.find(f => {
        return f.customFieldID === '9'
      })

    let oldItem = {
      qoh: currentItemShop.qoh,
      reorderPoint: currentItemShop.reorderPoint,
      reorderLevel: currentItemShop.reorderLevel,
      totalDurationText: oldCustomField ? oldCustomField.value : undefined,
    }

    let newItem = {
      qoh: i.statistics.totalReorderpoint,
      reorderPoint: i.statistics.totalReorderpoint,
      reorderLevel: Math.round(i.statistics.totalReorderpoint * 2),
      totalDurationText: `${i.statistics.totalDuration} weken`,
    }

    // Do the actual comparison: Limited option is enough and the
    // writing, only needed when reorderpoint is beyond 0
    if (
      i.statistics.totalReorderpoint > 0 &&
      JSON.stringify(oldItem) !== JSON.stringify(newItem)
    ) {
      acc.push({
        itemID: i.itemID,
        payload: {
          ItemShops: {
            ItemShop: [
              {
                itemShopID: currentItemShop.itemShopID,
                qoh: newItem.qoh,
                reorderPoint: newItem.reorderPoint,
                reorderLevel: newItem.reorderLevel,
              },
            ],
          },
          CustomFieldValues: {
            CustomFieldValue: [
              {
                customFieldID: '9',
                value: newItem.totalDurationText,
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
