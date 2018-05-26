import _ from 'lodash'

export default (items, itemIDsValue) => {
  console.log('Calculate category report')
  // Create searchable object from array
  var itemsHashed = {}
  items.forEach(i => {
    itemsHashed[i.itemID] = i
  })

  // Calculate value per category
  let rawCategoryReport = {}
  itemIDsValue.forEach((item, key) => {
    if (
      item.id != 0 &&
      itemsHashed[item.id] &&
      itemsHashed[item.id].categoryID != 0
    ) {
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
    } else if (
      item.id != 0 &&
      itemsHashed[item.id] &&
      itemsHashed[item.id].categoryID == 0
    ) {
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
    if (
      categoryReport[category.split[0]] &&
      categoryReport[category.split[0]][category.split[1]]
    ) {
      categoryReport[category.split[0]][category.split[1]].totaal += parseFloat(
        category.value
      )
    } else if (category.split[1]) {
      categoryReport[category.split[0]][category.split[1]] = {
        totaal: category.value,
      }
    }
  })

  categoryReport.etc = {
    totaal:
      categoryReport.Ongecategoriseerd.totaal + categoryReport.Diversen.totaal,
  }

  categoryReport.totaal = {
    totaal:
      ((categoryReport.etc && categoryReport.etc.totaal) || 0) +
      ((categoryReport.Hengelsport && categoryReport.Hengelsport.totaal) || 0) +
      ((categoryReport.Aquarium && categoryReport.Aquarium.totaal) || 0) +
      ((categoryReport.Dierenspeciaal &&
        categoryReport.Dierenspeciaal.totaal) ||
        0),
  }

  categoryReport.normaal = {
    totaal:
      ((categoryReport.totaal && categoryReport.totaal.totaal) || 0) -
      ((categoryReport.Hengelsport &&
        categoryReport.Hengelsport.Visvergunningen &&
        categoryReport.Hengelsport.Visvergunningen.totaal) ||
        0) -
      ((categoryReport.Hengelsport &&
        categoryReport.Hengelsport['Levend Aas'] &&
        categoryReport.Hengelsport['Levend Aas'].totaal) ||
        0) -
      ((categoryReport.Aquarium &&
        categoryReport.Aquarium.Vis &&
        categoryReport.Aquarium.Vis.totaal) ||
        0) -
      ((categoryReport.Aquarium &&
        categoryReport.Aquarium.Planten &&
        categoryReport.Aquarium.Planten.totaal) ||
        0),
  }

  let categoryReportFixed = {}
  _.map(categoryReport, (category, key) => {
    categoryReportFixed[key] = {
      totaal: category.totaal.toFixed(0),
      percentage: (
        category.totaal /
        categoryReport.totaal.totaal *
        100
      ).toFixed(0),
    }
    _.map(categoryReport[key], (nestedCategory, nestedKey) => {
      if (nestedCategory.totaal && nestedKey) {
        categoryReportFixed[key][nestedKey] = {
          totaal: nestedCategory.totaal.toFixed(0),
          percentage: (
            nestedCategory.totaal /
            categoryReport.totaal.totaal *
            100
          ).toFixed(0),
        }
      }
    })
  })

  return categoryReportFixed
}
