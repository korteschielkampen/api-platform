import { color } from 'd3-color'

export default categories => {
  let categoryColors = [
    { name: 'Hengelsport', categoryID: '221', color: 'hsl(151, 100%, 42%)' },
    { name: 'Dierenspeciaal', categoryID: '97', color: 'hsl(42, 100%, 50%)' },
    { name: 'Aquarium', categoryID: '98', color: 'hsl(204, 100%, 43%)' },
    {
      name: 'Speciale Categorieën',
      categoryID: 'special-root',
      color: 'hsl(0, 0%, 50%)',
    },
  ]

  let rootCategories = _.map(
    _.filter(categories, { nodeDepth: '0' }),
    (rc, k) => {
      rc.colorRange = color(categoryColors[k].color)
      return rc
    }
  )

  _.forEach(categories, c => {
    _.forEach(rootCategories, rc => {
      if (
        parseInt(rc.leftNode) <= parseInt(c.leftNode) &&
        parseInt(rc.rightNode) >= parseInt(c.rightNode)
      ) {
        let colorBrightness =
          (parseInt(c.leftNode) - parseInt(rc.leftNode)) /
          (parseInt(rc.rightNode) - parseInt(rc.leftNode))
        c.color = rc.colorRange.brighter(colorBrightness * 1.6).hex()
      }
    })
  })

  return categories
}
