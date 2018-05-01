import request from '../../general/request.js';
import readAccessToken from '../../auth/moneybird/read-token.js'

export default async (invoice) => {
  let access_token = await readAccessToken();
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
