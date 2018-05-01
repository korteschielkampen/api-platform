import request from '../../general/request.js';
import readAccessToken from '../../auth/moneybird/read-token.js'

export default async (financial_statement) => {
  let access_token = await readAccessToken();
  const options = {
    method: "POST",
    body: JSON.stringify(financial_statement),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}` }
  };
  const apiUrl = 'https://moneybird.com/api/v2/211688738215954171/financial_statements.json';

  return await request(apiUrl, options);
}
