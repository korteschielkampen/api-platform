import { concatTag } from './payload-tag.js'

// Small function to make ranges
const range = (start, end) => {
  let length = end - start + 1
  return Array.from({ length: length }, (_, i) => i).reduce((acc, i) => {
    acc[i + start] = true
    return acc
  }, {})
}

// exclusion categories:
const excludedCategories = {
  ...range(50, 87), // '102': Planten 50
  ...range(32, 39), // '110': Planten 32
  ...range(246, 263), // '170': Levend Aas
  ...range(308, 309), // '154': Visvergunning
}

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
        return f.customFieldID === '10'
      })

    let oldItem = {
      reorderPoint: currentItemShop.reorderPoint,
      reorderLevel: currentItemShop.reorderLevel,
      totalDuration: oldCustomField
        ? parseInt(oldCustomField.value)
        : undefined,
      tags: concatTag(i.Tags || false).find(t => {
        return t.tag === 'auto-bestel'
      }),
    }

    let newItem = {
      reorderPoint: i.statistics.totalReorderpoint,
      reorderLevel: i.statistics.totalReorderLevel, // Chosen because 1 will round to 1
      totalDuration: i.statistics.totalDuration,
      tags: concatTag(i.Tags || false, 'auto-bestel').find(t => {
        return t.tag === 'auto-bestel'
      }),
    }

    let reasons = {
      growthReorderPoint: `\n - :moneybag::sparkle: Nabestelpunt is verhoogd naar ${
        newItem.reorderPoint
      } (${oldItem.reorderPoint})`,
      growthReorderLevel: `\n - :moneybag::sparkle: Nabestelniveau is verhoogd naar ${
        newItem.reorderLevel
      } (${oldItem.reorderLevel})`,
      recessReorderPoint: `\n - :moneybag::small_red_triangle_down: Nabestelpunt is verlaagd naar ${
        newItem.reorderPoint
      } (${oldItem.reorderPoint})`,
      recessReorderlevel: `\n - :moneybag::small_red_triangle_down: Nabestelniveau is verlaagd naar ${
        newItem.reorderLevel
      } (${oldItem.reorderLevel})`,
      stop: `\n - :x: Nabestelpunt en niveau zijn op nul gezet`,
      newStock: `\n - :package::sparkle: Voorraadtermijn is verhoogd naar ${
        newItem.totalDuration
      } (${oldItem.totalDuration})`,
      lowerStock: `\n - :package::small_red_triangle_down: Voorraadtermijn is verlaagd naar ${
        newItem.totalDuration
      } (${oldItem.totalDuration})`,
      outOfStock: `\n - :package::fire: Voorraadtermijn is 0`,
      unknown: `\n - Artikel is om onbekende reden geupdated`,
    }

    let reason = ''

    if (oldItem.reorderPoint < newItem.reorderPoint) {
      reason += reasons.growthReorderPoint
    } else if (oldItem.reorderPoint > newItem.reorderPoint) {
      reason += reasons.recessReorderPoint
    }

    if (oldItem.reorderLevel < newItem.reorderLevel) {
      reason += reasons.growthReorderLevel
    } else if (oldItem.reorderLevel > newItem.reorderLevel) {
      reason += reasons.recessReorderlevel
    }

    if (
      newItem.reorderPoint + newItem.reorderLevel === 0 &&
      newItem.reorderPoint + newItem.reorderLevel !== 0
    ) {
      reason += reasons.stop
    }

    if (oldItem.totalDuration < newItem.totalDuration) {
      reason += reasons.newStock
    } else if (oldItem.totalDuration > newItem.totalDuration) {
      reason += reasons.lowerStock
    }

    if (newItem.totalDuration === 0) {
      reason += reasons.outOfStock
    }

    if (reason === '') {
      reason += reasons.unknown
    }

    if (JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
      // Do the actual comparison: Limited option is enough and the
      // writing, only needed when reorderpoint is beyond 0
      acc.push({
        itemID: i.itemID,
        data: i,
        reason: reason,
        payload: {
          ItemShops: {
            ItemShop: [
              {
                itemShopID: currentItemShop.itemShopID,
                reorderPoint: newItem.reorderPoint,
                reorderLevel: newItem.reorderLevel,
              },
            ],
          },
          CustomFieldValues: {
            CustomFieldValue: [
              {
                customFieldID: '10',
                value: newItem.totalDuration,
              },
            ],
          },
          Tags: concatTag(i.Tags || false, 'auto-bestel'),
        },
      })
    }
    return acc
  }, [])

  // Remove non-default items
  payloads = payloads.filter(i => {
    return (
      i.data.itemType === 'default' &&
      i.data.itemID !== '0' &&
      (i.data.Category ? !excludedCategories[i.data.Category.leftNode] : true)
    )
  })

  // Push reorderpayload to updateItems
  return payloads
}
