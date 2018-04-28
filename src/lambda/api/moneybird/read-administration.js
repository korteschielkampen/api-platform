const fetch = require('node-fetch');

export default async (access_token) => {
  const options = {
    method: "GET",
    headers: {
      'authorization': `Bearer ${access_token}`
    }
  };
  const apiUrl = 'https://moneybird.com/api/v2/administrations.json';

  const res = await fetch(apiUrl, options);
  if (!res.ok) {throw await res.json();}
  console.log("-------------READ ADMINISTRATION WHY---------------------")
  console.log(await res.json());
  console.log("-------------READ ADMINISTRATION WHY---------------------")
  return await res.json();
}
