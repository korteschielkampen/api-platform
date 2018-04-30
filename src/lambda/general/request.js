const fetch = require('node-fetch');

export default async (apiUrl, options) => {
  const res = await fetch(apiUrl, options);
  if (!res.ok) {throw await res.json();}
  return await res.json();
}
