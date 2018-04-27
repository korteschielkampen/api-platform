const fetch = require('node-fetch');

export default async (temporary_access_token, respond) => {
  const payload = {
    client_id: "4c23f9e681c44d339359a38dc340522fae805ddab5e372c39762ef91c080179d",
    client_secret: process.env.LIGHTSPEED,
    code: temporary_access_token,
    grant_type: "authorization_code",
  };
  const options = {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  };

  try {
    const response = await fetch('https://cloud.lightspeedapp.com/oauth/access_token.php', options);
    const json = await response.json();
    return json;
  } catch(err) {
    respond({ status: 422, body: {error: err}});
  }
}
