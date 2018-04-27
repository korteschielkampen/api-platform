const fetch = require('node-fetch');

export default async (tokens, respond) => {
  const options = {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${tokens.access_token}`
    }
  };

  try {
    const response = await fetch('https://api.lightspeedapp.com/API/Account.json', options);
    const json = await response.json();
    return json;
  } catch(err) {
    respond({ status: 422, body: {error: err}});
  }
}
