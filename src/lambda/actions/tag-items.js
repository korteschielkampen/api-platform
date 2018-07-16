import getSaleslines from '../models/sales/sold-items.js'
import createMergedItems from '../models/sales/merged-items.js'
import createTagPayloads from '../models/tag/create-tag-payloads.js'
import updateItems from './update-items.js'

export default async (sales, items, tag) => {
  // Get the sold items statistics and add them to the items themselves
  let saleslines = getSaleslines(sales)

  // Merge saleslines with items and remove '0' because it cannot be updated
  items = createMergedItems(saleslines, items, {
    lightweight: false,
  })

  if (tag === 'voorraadoverschot') {
    console.log('Voorraadoverschot: Erg gecompliceerde rekensom')
  } else if (tag === 'verkocht2018') {
    console.log('Verkocht2018: Geen algoritme')
  }

  // Create tag payload from original tags and the new one
  let itemPayloads = createTagPayloads(items, tag)

  // Send the tags away
  // await updateItems(itemPayloads)
}
