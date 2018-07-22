import getSaleStatsByItem from '../models/item/statistics-sales-byitem.js'
import createMergedItems from '../models/item/merged-items.js'
import createTagPayloads from '../models/item/payload-tag.js'
import updateItems from './update-items.js'

export default async (sales, items, tag) => {
  // Get the sold items statistics and add them to the items themselves
  let saleStatsByItem = getSaleStatsByItem(sales)

  // Merge saleslines with items and remove '0' because it cannot be updated
  items = createMergedItems(saleStatsByItem, items, {
    lightweight: false,
  })

  if (tag === 'voorraadoverschot') {
    console.log('Voorraadoverschot: Erg gecompliceerde rekensom')
  } else if (tag === 'verkocht2018') {
    console.log('Verkocht2018: Tagging op basis van solditems')
    // Create tag payload from original tags and the new one
    let itemPayloads = createTagPayloads(items, tag)

    // Send the tags away
    await updateItems(itemPayloads)
  }
}
