import { color } from 'd3-color'

export default [
  {
    name: 'Winkeltotaal',
    categoryID: '0',
    nodeDepth: '-1',
    parentID: '-1',
    color: color('hsl(0, 0%, 90%)').hex(),
  },
  {
    name: 'Speciale Categorieën',
    categoryID: 'special-root',
    nodeDepth: '0',
    parentID: '0',
    leftNode: '9001',
    rightNode: '9008',
  },
  {
    name: 'Ongecategoriseerd',
    categoryID: 'special-uncategorised',
    nodeDepth: '1',
    parentID: 'special-root',
    leftNode: '9002',
    rightNode: '9003',
  },
  {
    name: 'Diversen',
    categoryID: 'special-misc',
    nodeDepth: '1',
    parentID: 'special-root',
    leftNode: '9004',
    rightNode: '9005',
  },
  {
    name: 'Gearchiveerd of onbekend',
    categoryID: 'special-notfound',
    nodeDepth: '1',
    parentID: 'special-root',
    leftNode: '9006',
    rightNode: '9007',
  },
]
