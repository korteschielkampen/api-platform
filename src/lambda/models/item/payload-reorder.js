import { concatTag } from './payload-tag.js'

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
      tags: concatTag(i.Tags || false).find(t => {
        return t.tag === 'auto-bestel'
      }),
    }

    let newItem = {
      qoh: i.statistics.totalReorderLevel
        ? i.statistics.totalReorderpoint + 1
        : 0,
      reorderPoint: i.statistics.totalReorderpoint,
      reorderLevel: i.statistics.totalReorderLevel, // Chosen because 1 will round to 1
      totalDurationText: `${i.statistics.totalDuration} weken`,
      tags: concatTag(i.Tags || false, 'auto-bestel').find(t => {
        return t.tag === 'auto-bestel'
      }),
    }

    // Do the actual comparison: Limited option is enough and the
    // writing, only needed when reorderpoint is beyond 0
    if (JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
      acc.push({
        itemID: i.itemID,
        data: i,
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
          Tags: concatTag(i.Tags || false, 'auto-bestel'),
        },
      })
    }
    return acc
  }, [])

  // Push reorderpayload to updateItems
  return payloads
}
