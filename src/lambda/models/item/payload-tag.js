const concatTag = (Tags, tagToBeAdded) => {
  // Clone object
  let newTags = []

  // Old tags
  if (Tags.tag) {
    Tags.tag.forEach(tag => {
      newTags.push({ tag: tag })
    })
  }

  // Added tag
  if (tagToBeAdded) {
    newTags.push({ tag: tagToBeAdded })
  }

  return newTags
}

export default (items, newTag) => {
  let itemsToBeUpdated = []
  _.forEach(items, item => {
    if (item.archived === 'false') {
      let itemToBeUpdated = {
        itemID: item.itemID,
        payload: {},
      }

      // This can be a little bit more efficient, but doens't need to
      if (item.Tags) {
        itemToBeUpdated.payload = concatTag(item.Tags, newTag)
      } else {
        itemToBeUpdated.payload = concatTag([], newTag)
      }

      itemsToBeUpdated.push(itemToBeUpdated)
    }
  })
  return itemsToBeUpdated
}

export { concatTag }
