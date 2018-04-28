// client_id=9a833de2d13b07dfdfb50a8124b148d8
// client_secret=b376c8fbed732a5d1495a510a2f7d2738cdd4986516f1d34dd5cc00de4dcfe11
// code=1192e141cfd1839e1d477ac0f91268deec523fae5d14748547a8a22fc3a5b39b
// redirect_uri=urn:ietf:wg:oauth:2.0:oob
// grant_type=authorization_code

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
