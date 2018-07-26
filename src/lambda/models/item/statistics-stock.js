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
    if (i.ItemShops) {
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
