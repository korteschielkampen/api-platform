// Set additional statistics for stock
import prognosedCost from './prognosed-cost.js'

const reorderOptions = [
  {
    name: 'tight',
    function: n => n / 6, // 1 maand
    optionID: '29',
  },
  {
    name: 'normal',
    function: n => n / 2, // 3 maand
    optionID: '15',
  },
  {
    name: 'long',
    function: n => n, // 6 maand
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
  let reorderpoint = Math.round(reorderFunc(i.statistics.totalSold))
  return reorderpoint
}

const calculateDuration = i => {
  let sellingSpeedInWeeks = i.statistics.totalSold / 26
  let duration = Math.floor(i.statistics.totalStock / sellingSpeedInWeeks)
  return duration
}

export default items => {
  items = items.map(i => {
    i.statistics = {
      ...i.statistics,
      totalDuration: 0,
      totalReorderpoint: 0,
      totalReorderpointValue: 0,
      totalStock: 0,
      totalStockValue: 0,
    }
    if (
      i.ItemShops &&
      (i.Category && !excludedCategories[i.Category.leftNode])
    ) {
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

      i.statistics.totalReorderpoint = calculateReorderpoint(i, reorderOption)
      i.statistics.totalReorderpointValue =
        i.statistics.totalReorderpoint * costCorr
      i.statistics.totalDuration = calculateDuration(i, 'normal')
    }
    return i
  })
  return items
}
