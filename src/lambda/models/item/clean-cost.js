export default (cost, price) => {
  cost = parseFloat(cost)
  if (!cost || cost > price) {
    cost = 0.5 * price
  }
  return cost
}
