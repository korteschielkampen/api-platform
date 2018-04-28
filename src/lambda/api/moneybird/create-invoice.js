const fetch = require('node-fetch');

export default async (access_token, invoice) => {
  const options = {
    method: "POST",
    body: JSON.stringify(invoice),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}` }
  };
  const apiUrl = 'https://moneybird.com/api/v2/211688738215954180/sales_invoices.json';

  console.log("------------BEFORE MB---------------")
  console.log(apiUrl, options)
  console.log("------------BEFORE MB---------------")

  const res = await fetch(apiUrl, options);
  if (!res.ok) {throw await res.json();}
  return await res.json();
}
