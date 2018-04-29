const fetch = require('node-fetch');

export default async (access_token, financial_statement) => {
  const options = {
    method: "POST",
    body: JSON.stringify(financial_statement),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}` }
  };
  const apiUrl = 'https://moneybird.com/api/v2/211688738215954171/financial_statements.json';

  const res = await fetch(apiUrl, options);
  if (!res.ok) {throw await res.json();}
  return await res.json();
}
