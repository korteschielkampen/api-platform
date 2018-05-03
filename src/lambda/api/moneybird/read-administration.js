import request from '../general/request.js';

export default async (access_token) => {
  const options = {
    method: "GET",
    headers: {
      'authorization': `Bearer ${access_token}`
    }
  };
  const apiUrl = 'https://moneybird.com/api/v2/administrations.json';

  return await request(apiUrl, options);
}
