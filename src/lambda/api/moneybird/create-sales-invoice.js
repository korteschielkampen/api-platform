import request from '../../general/request.js';

export default async (access_token, invoice) => {
  const options = {
    method: "POST",
    body: JSON.stringify(invoice),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}` }
  };
  const apiUrl = 'https://moneybird.com/api/v2/211688738215954171/sales_invoices.json';

  return await request(apiUrl, options);
}
