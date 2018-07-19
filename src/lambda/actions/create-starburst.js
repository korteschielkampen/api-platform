import getSoldItems from '../models/item/sold-items.js'
import createMergedItems from '../models/item/merged-items.js'
import createReorderPoints from './create-reorder-points.js'
import specialCategories from '../models/category/special-categories.js'
import colorCategories from '../models/category/color-categories.js'
import mergeItemsAndCategories from '../models/category/merge-items-categories.js'
import nestCategories from '../models/category/nest-categories.js'

export default (sales, items, categories) => {
  console.log('Get saleslines')
  // Saleline endpoint is not used yet, extracting them from sale saleline relation
  let soldItems = getSoldItems(sales)

  console.log('Merge items')
  // Salelines need to be merged with the items for the category foreign key
  let mergedItems = createMergedItems(soldItems, items, {
    lightweight: true,
  })

  console.log('Get reorderpoints')
  let reorderItems = createReorderPoints(sales, items)
  let reorderItemsHashed = {}
  _.forEach(reorderItems, i => {
    reorderItemsHashed[i.itemID] = i
  })
  mergedItems = _.map(mergedItems, i => {
    if (reorderItemsHashed[i.itemID]) {
      i.statistics.reoderpoint =
        reorderItemsHashed[i.itemID].statistics.reorderpoint
      i.statistics.reorderpointValue =
        reorderItemsHashed[i.itemID].statistics.reorderpointValue
    }
    return i
  })

  console.log('Adding special categories')
  // Setting up flare, and other special categories with appropriate nodes
  categories = categories.concat(specialCategories)

  console.log('Merge sold item statistics and categories')
  // Adding item statistics to the categories
  categories = mergeItemsAndCategories(mergedItems, categories)

  console.log('Coloring starburst')
  // Coloring the categories for nice viewing experience
  categories = colorCategories(categories)

  console.log('Nest categories')
  // Nesting the categories to the starburst datastructure and return it
  return nestCategories(categories)
}
