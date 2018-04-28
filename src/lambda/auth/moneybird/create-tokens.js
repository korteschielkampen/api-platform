const fetch = require('node-fetch');

export default async (temporary_access_token) => {
  const payload = {
    client_id: process.env.MONEYBIRD_CLIENT,
    client_secret: process.env.MONEYBIRD_SECRET,
    redirect_uri: encodeURI("https://rjkorteschiel.nl/moneybird-redirect/"),
    code: temporary_access_token,
    grant_type: "authorization_code",
  };
  const options = {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  };
  const apiUrl = 'https://moneybird.com/oauth/token';

  const res = await fetch(apiUrl, options);
  if (!res.ok) {throw await res.json();}
  return await res.json();
}
