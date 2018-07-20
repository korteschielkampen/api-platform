import _ from 'lodash'

export default (soldItems, items, options) => {
  return _.map(_.merge(_.keyBy(items, 'itemID'), soldItems), i => i)
}
