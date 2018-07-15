export default (items, newTag) => {
  let itemsToBeUpdated = []
  _.forEach(items, item => {
    if (item.archived === 'false') {
      let itemToBeUpdated = {
        itemID: item.itemID,
        payload: {
          Tags: [],
        },
      }

      // This can be a little bit more efficient, but doens't need to
      if (item.Tags) {
        if (typeof item.Tags.tag === 'string') {
          itemToBeUpdated.payload.Tags.push({ tag: item.Tags.tag })
          itemToBeUpdated.payload.Tags.push({ tag: newTag })
        } else {
          item.Tags.tag.forEach(tag => {
            itemToBeUpdated.payload.Tags.push({ tag: tag })
          })
          itemToBeUpdated.payload.Tags.push({ tag: newTag })
        }
      } else {
        itemToBeUpdated.payload.Tags.push({ tag: newTag })
      }

      itemsToBeUpdated.push(itemToBeUpdated)
    }
  })
  return itemsToBeUpdated
}
