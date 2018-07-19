export default (cost, price) => {
  let costCorr = parseFloat(cost)
  if (!costCorr || costCorr > price) {
    costCorr = 0.5 * price
  }
  return costCorr
}
