export default(cost, price) => {
  if (!cost || cost > price) {
    cost = 0.5 * price
  }
  return cost
}
