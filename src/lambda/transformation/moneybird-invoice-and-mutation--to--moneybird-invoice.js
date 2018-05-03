import moment from 'moment'

export default (invoice, mutation) => {
  let booking = {
    "booking_type": "SalesInvoice",
    "booking_id": invoice.id,
    "price_base": mutation.financial_mutations[0].amount
  };

  return booking;
}
