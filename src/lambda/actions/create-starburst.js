import getSaleLines from '../models/sales/sold-items.js'
import createMergedItems from '../models/sales/merged-items.js'
import specialCategories from '../models/category/special-categories.js'
import colorCategories from '../models/category/color-categories.js'
import mergeItemsAndCategories from '../models/category/merge-items-categories.js'
import nestCategories from '../models/category/nest-categories.js'

export default (sales, items, categories) => {
  console.log('Get saleslines')
  // Saleline endpoint is not used yet, extracting them from sale saleline relation
  let saleslines = getSaleLines(sales)

  console.log('Merge items')
  // Salelines need to be merged with the items for the category foreign key
  items = createMergedItems(saleslines, items, {
    lightweight: true,
  })

  console.log('Adding special categories')
  // Setting up flare, and other special categories with appropriate nodes
  categories = categories.concat(specialCategories)

  console.log('Merge sold item statistics and categories')
  // Adding item statistics to the categories
  categories = mergeItemsAndCategories(items, categories)

  console.log('Coloring starburst')
  // Coloring the categories for nice viewing experience
  categories = colorCategories(categories)

  console.log('Nest categories')
  // Nesting the categories to the starburst datastructure and return it
  return nestCategories(categories)
}
