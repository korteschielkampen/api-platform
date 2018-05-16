import _ from 'lodash'

export default (items, itemIDsValue) => {
  // Create object from array
  var itemsHashed = {}
  items.forEach(i => {
    itemsHashed[i.itemID] = i
  })

  let count = 0
  // Calculate value per category
  let rawCategoryReport = {}
  itemIDsValue.forEach((item, key) => {
    if (item.id == '16136') {
      console.log(item)
    }
    count += parseInt(item.value)
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
      let value = item.value
      rawCategoryReport['Ongecategoriseerd'] = {
        category: 'Ongecategoriseerd',
        value: parseFloat(value),
      }
    } else {
      let value = item.value
      rawCategoryReport['Diversen'] = {
        category: 'Diversen',
        value: parseFloat(value),
      }
    }
  })
  console.log(count)

  // console.log(rawCategoryReport)

  let categoryReport = {
    Dierenspeciaal: 0,
    Voeders: 0,
    Kauw: 0,
    Aquarium: 0,
    Vis: 0,
    Planten: 0,
    Hengelsport: 0,
    Passen: 0,
    Aas: 0,
    Ongecategoriseerd: 0,
    Diversen: 0,
  }

  Object.entries(rawCategoryReport).forEach(([key, value]) => {
    value.categorySplit = value.category.split('/')

    // VERY WEAK SHIT!!!
    if (value.categorySplit[0] == 'Dierenspeciaal') {
      categoryReport['Dierenspeciaal'] += parseFloat(value.value)
    }
    if (value.categorySplit[0] == 'Aquarium') {
      categoryReport['Aquarium'] += parseFloat(value.value)
    }
    if (value.categorySplit[0] == 'Ongecategoriseerd') {
      categoryReport['Ongecategoriseerd'] += parseFloat(value.value)
    }
    if (value.categorySplit[0] == 'Diversen') {
      categoryReport['Diversen'] += parseFloat(value.value)
    }
  })

  return categoryReport
}
