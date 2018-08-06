// Set additional statistics for stock
import prognosedCost from './prognosed-cost.js'

const reorderOptions = [
  {
    name: 'tight',
    function: n => n / 12, // 2 weken
    optionID: '29',
  },
  {
    name: 'normal',
    function: n => n / 6, // 1 maand
    optionID: '15',
  },
  {
    name: 'long',
    function: n => n / 3, // 3 maand
    optionID: '30',
  },
  {
    name: 'specialistic',
    function: n => 1, // 1 constant
    optionID: '28',
  },
  {
    name: 'exit',
    function: n => 0, // 0 constant
    optionID: '16',
  },
  {
    name: 'remarkable',
    function: n => undefined, // handmatig
    optionID: '31',
  },
]

const calculateReorderpoint = (i, selectedReorderOption) => {
  let reorderFunc = (
    reorderOptions.find(o => {
      return o.optionID === selectedReorderOption
    }) ||
    reorderOptions.find(o => {
      return o.optionID === '15'
    })
  ).function

  // Calculate flags
  let reorderpoint = reorderFunc(i.statistics.totalSold)
  return reorderpoint
}

const calculateDuration = i => {
  let sellingSpeedInWeeks = i.statistics.totalSold / 26
  let duration = Math.round(i.statistics.totalStock / sellingSpeedInWeeks)

  if (!isFinite(duration)) {
    duration = 26 // Articles that are never sold should be given a decent chance
    if (isNaN(duration)) {
      // Articles that are not in stock, and are never sold,
      // yet somehow end up being evaluated
      duration = 0
    }
  }
  return duration
}

export default items => {
  items = items.map(i => {
    i.statistics = {
      ...i.statistics,
      totalDuration: 0,
      totalReorderpoint: 0,
      totalReorderLevel: 0,
      totalReorderpointValue: 0,
      totalStock: 0,
      totalStockValue: 0,
    }

    if (i.ItemShops && i.itemType === 'default') {
      let qoh = parseInt(
        i.ItemShops.ItemShop.find(i => i.shopID == '1' && i).qoh
      )
      let salesPrice = parseInt(
        i.Prices.ItemPrice.find(i => i.useType == 'Default' && i).amount
      )
      let costCorr = prognosedCost(i.avgCost, salesPrice)

      i.statistics.totalStock = qoh
      i.statistics.totalStockValue = costCorr * i.statistics.totalStock

      let reorderOptionsField =
        i.CustomFieldValues &&
        i.CustomFieldValues.CustomFieldValue.find(c => {
          return c.customFieldID === '5'
        })

      let reorderOption =
        reorderOptionsField && reorderOptionsField.value.customFieldChoiceID

      i.statistics.totalReorderpoint = Math.round(
        calculateReorderpoint(i, reorderOption)
      )
      i.statistics.totalReorderpointValue =
        i.statistics.totalReorderpoint * costCorr
      i.statistics.totalReorderLevel = Math.round(
        calculateReorderpoint(i, reorderOption) * 2
      )
      i.statistics.totalDuration = calculateDuration(i, 'normal')
    }
    return i
  })
  return items
}
