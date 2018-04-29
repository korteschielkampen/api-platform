const fetch = require('node-fetch');

export default async (access_token, invoice_id) => {
  const options = {
    method: "PATCH",
    headers: {
      'Authorization': `Bearer ${access_token}` }
  };
  const apiUrl = `https://moneybird.com/api/v2/211688738215954171/sales_invoices/${invoice_id}/send_invoice.json`;

  const res = await fetch(apiUrl, options);
  if (!res.ok) {throw await res.json();}
  return await res.json();
}
