const fetch = require('node-fetch');

export default async (access_token, booking_id, booking) => {
  const options = {
    method: "PATCH",
    body: JSON.stringify(booking),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}` }
  };
  const apiUrl = `https://moneybird.com/api/v2/211688738215954171/financial_mutations/${booking_id}/link_booking.json`;

  const res = await fetch(apiUrl, options);
  if (!res.ok) {throw await res.json();}
  return await res.json();
}
