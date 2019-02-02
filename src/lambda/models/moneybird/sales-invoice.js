import moment from 'moment'

export default dayreport => {
  let invoice = {
    sales_invoice: {
      reference: `Automated Lightspeed Invoice - ${moment(
        dayreport.date
      ).format()}`,
      contact_id: '211718269128672982',
      invoice_date: moment(dayreport.date).format('YYYY-MM-DD'),
      state: 'open',
      prices_are_incl_tax: true,
      details_attributes: [],
    },
  }

  // Hoog BTW
  if (parseFloat(dayreport.financialReport.tax.hoog.amount) !== 0) {
    invoice.sales_invoice.details_attributes.push({
      description: 'Hoog BTW tarief',
      tax_rate_id: '211688738873410854',
      ledger_account_id: '218027560947156696',
      price: dayreport.financialReport.tax.hoog.amount,
    })
  }

  // Laag BTW
  if (parseFloat(dayreport.financialReport.tax.laag.amount) !== 0) {
    invoice.sales_invoice.details_attributes.push({
      description: 'Laag BTW tarief',
      tax_rate_id: '242334259090556135',
      ledger_account_id: '243892803759768652',
      price: dayreport.financialReport.tax.laag.amount,
    })
  }

  // Nul BTW
  if (parseFloat(dayreport.financialReport.tax.onbelast.amount) !== 0) {
    invoice.sales_invoice.details_attributes.push({
      description: 'Onbelast BTW tarief',
      tax_rate_id: '212145631538448378',
      ledger_account_id: '218027616763905200',
      price: dayreport.financialReport.tax.onbelast.amount,
    })
  }

  // Cadeaukaart
  if (parseFloat(dayreport.financialReport.payments.gift.amount) !== 0) {
    invoice.sales_invoice.details_attributes.push({
      description: 'Betalingen met of uitgifte van cadeaukaarten',
      tax_rate_id: '212145631538448378',
      ledger_account_id: '212771713877804212',
      price: -dayreport.financialReport.payments.gift.amount,
    })
  }

  // Kredietaccount
  if (parseFloat(dayreport.financialReport.payments.credit.amount) !== 0) {
    invoice.sales_invoice.details_attributes.push({
      description: 'Betalingen met of uitgifte van klantkredieten',
      price: -dayreport.financialReport.payments.credit.amount,
      tax_rate_id: '212145631538448378',
      ledger_account_id: '212174619871807198',
    })
  }

  return invoice
}
