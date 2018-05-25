import calculateFinancialReport from '../transformation/lightspeed-sales--to--financial-report.js'

export default async sales => {
  return calculateFinancialReport(sales)
}
