const fetch = require('node-fetch');

export default refreshTokens = async (code, callback) => {
  const payload = {
    client_id: process.env.LIGHTSPEED_CLIENT,
    client_secret: process.env.LIGHTSPEED_SECRET,
    refresh_token: code,
    grant_type: "refresh_token",
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
    callback({ status: 422, body: {error: err}});
  }
}
