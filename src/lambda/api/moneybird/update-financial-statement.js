import request from '../../general/request.js';

export default async (access_token, booking_id, booking) => {
  const options = {
    method: "PATCH",
    body: JSON.stringify(booking),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}` }
  };
  const apiUrl = `https://moneybird.com/api/v2/211688738215954171/financial_mutations/${booking_id}/link_booking.json`;

  return await request(apiUrl, options);
}
