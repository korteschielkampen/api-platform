import _ from 'lodash'

export default (items, itemIDsValue) => {
  // Create searchable object from array
  var itemsHashed = {}
  items.forEach(i => {
    itemsHashed[i.itemID] = i
  })

  // Calculate value per category
  let rawCategoryReport = {}
  itemIDsValue.forEach((item, key) => {
    if (item.id != 0 && itemsHashed[item.id].categoryID != 0) {
      let value = parseFloat(item.value)
      if (rawCategoryReport[itemsHashed[item.id].Category.fullPathName]) {
        value += parseFloat(
          rawCategoryReport[itemsHashed[item.id].Category.fullPathName].value
        )
      }
      rawCategoryReport[itemsHashed[item.id].Category.fullPathName] = {
        category: itemsHashed[item.id].Category.fullPathName,
        value: value,
      }
    } else if (item.id != 0 && itemsHashed[item.id].categoryID == 0) {
      if (rawCategoryReport['Ongecategoriseerd']) {
        rawCategoryReport['Ongecategoriseerd'] = {
          category: 'Ongecategoriseerd',
          value:
            rawCategoryReport['Ongecategoriseerd'].value +
            parseFloat(item.value),
        }
      } else {
        rawCategoryReport['Ongecategoriseerd'] = {
          category: 'Ongecategoriseerd',
          value: parseFloat(item.value),
        }
      }
    } else {
      if (rawCategoryReport['Diversen']) {
        rawCategoryReport['Diversen'] = {
          category: 'Diversen',
          value: rawCategoryReport['Diversen'].value + parseFloat(item.value),
        }
      } else {
        rawCategoryReport['Diversen'] = {
          category: 'Diversen',
          value: parseFloat(item.value),
        }
      }
    }
  })

  // Add categories
  let categoryReport = {}
  Object.entries(rawCategoryReport).forEach(([key, category]) => {
    // Split
    category.split = category.category.split('/')

    // Level one
    if (categoryReport[category.split[0]]) {
      categoryReport[category.split[0]].totaal += parseFloat(category.value)
    } else {
      categoryReport[category.split[0]] = { totaal: category.value }
    }

    // Level two
    if (categoryReport[category.split[0]][category.split[1]]) {
      categoryReport[category.split[0]][category.split[1]].totaal += parseFloat(
        category.value
      )
    } else {
      if (category.split[1]) {
        categoryReport[category.split[0]][category.split[1]] = {
          totaal: category.value,
        }
      }
    }
  })

  categoryReport.etc = {
    totaal:
      categoryReport.Ongecategoriseerd.totaal + categoryReport.Diversen.totaal,
  }

  categoryReport.totaal = {
    totaal:
      categoryReport.etc.totaal +
      categoryReport.Hengelsport.totaal +
      categoryReport.Aquarium.totaal +
      categoryReport.Dierenspeciaal.totaal,
  }

  let categoryReportFixed = {}
  _.map(categoryReport, (category, key) => {
    categoryReportFixed[key] = {
      totaal: category.totaal.toFixed(2),
    }
    _.map(categoryReport[key], (nestedCategory, nestedKey) => {
      if (nestedCategory.totaal && nestedKey) {
        categoryReportFixed[key][nestedKey] = {
          totaal: nestedCategory.totaal.toFixed(2),
        }
      }
    })
  })

  return categoryReportFixed
}
