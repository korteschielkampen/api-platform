import moment from 'moment'

export default dayReports => {
  // Moneybird values for cost and special income
  let rentIncome = 55
  let indirectCost = 186
  let specialCost = 22
  let dailyTotalCost = indirectCost + specialCost

  let totalProfit = 0
  let totalProfitPlusRent = 0
  let totalCost = 0
  let totalCostPlusLoans = 0
  let totalRevenue = 0
  dayReports = dayReports.map(report => {
    totalCost += indirectCost
    totalCostPlusLoans += dailyTotalCost
    if (report.sales) {
      // Totals
      totalProfit += report.financialReport.analysis.profit
      totalProfitPlusRent += report.financialReport.analysis.profit + rentIncome
      totalRevenue += report.financialReport.analysis.taxlessTotal

      // Daily extra's
      report.financialReport.analysis.profitRent =
        report.financialReport.analysis.profit + rentIncome
      report.financialReport.analysis.dailyTotalCost = dailyTotalCost
      report.financialReport.analysis.indirectCost = indirectCost
      return {
        ...report,
        special: {
          rentIncome: rentIncome,
          indirectCost: indirectCost,
          dailyTotalCost: dailyTotalCost,
        },
      }
    } else {
      return {
        ...report,
        special: {
          rentIncome: rentIncome,
          indirectCost: indirectCost,
          dailyTotalCost: dailyTotalCost,
        },
      }
    }
  })

  dayReports[dayReports.length - 1].financialReport.analysis = {
    ...dayReports[dayReports.length - 1].financialReport.analysis,
    totalProfit: totalProfit,
    totalProfitPlusRent: totalProfitPlusRent,
    totalCost: totalCost,
    totalCostPlusLoans: totalCostPlusLoans,
    totalRevenue: totalRevenue,
  }

  return dayReports
}
