import request from '../../general/request.js';
import readAccessToken from '../../auth/moneybird/read-token.js'

export default async (invoice_id) => {
  let access_token = await readAccessToken();
  const options = {
    method: "PATCH",
    headers: {
      'Authorization': `Bearer ${access_token}` }
  };
  const apiUrl = `https://moneybird.com/api/v2/211688738215954171/sales_invoices/${invoice_id}/send_invoice.json`;

  return await request(apiUrl, options);
}
