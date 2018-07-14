import parseInvoice from '../models/moneybird/sales-invoice.js'
import parseStatement from '../models/moneybird/financial-statement.js'
import parseBooking from '../models/moneybird/booking.js'
import createInvoice from '../api/moneybird/create-sales-invoice.js'
import sendInvoice from '../api/moneybird/update-sales-invoice.js'
import createMutation from '../api/moneybird/create-financial-statement.js'
import updateMutation from '../api/moneybird/update-financial-mutation.js'

export default async dayReport => {
  // Test if there is a invoice to be made
  if (dayReport.financialReport) {
    // Creating and sending invoice in Moneybird
    console.log('creating invoice')
    const invoice = parseInvoice(dayReport)
    let createdInvoice = await createInvoice(invoice)

    console.log('sending invoice')
    let sendedInvoice = await sendInvoice(createdInvoice.id)

    // Doing financial mutations if there are cash transactions
    if (parseFloat(dayReport.financialReport.payments.cash.amount) !== 0) {
      // Creating Mutation
      console.log('creating mutation')
      let financialStatement = parseStatement(dayReport)
      let createdMutation = await createMutation(financialStatement)

      // Linking the booking
      console.log('creating booking')
      let booking = await parseBooking(createdInvoice, createdMutation)
      let createdBooking = await updateMutation(
        createdMutation.financial_mutations[0].id,
        booking
      )
    } else {
      console.log(
        'No cash transactions, skipping the creating of a financial mutation'
      )
    }
  } else {
    console.log('Empty day report, skipping Moneybird entirely')
  }
}
