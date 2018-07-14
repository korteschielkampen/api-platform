import moment from 'moment'

export default dayreport => {
  let financialStatement = {
    financial_statement: {
      reference: `Kasboek - Lightspeed Dagontvangst - ${moment(
        dayreport.date.date
      ).format('YYYY-MM-DD')}`,
      financial_account_id: '211688922621675193',
      financial_mutations_attributes: {
        '1': {
          date: moment(dayreport.date.date).format('YYYY-MM-DD'),
          message: 'Winkelontvangsten',
          amount: dayreport.financialReport.payments.cash.amount,
        },
      },
    },
  }
  return financialStatement
}
