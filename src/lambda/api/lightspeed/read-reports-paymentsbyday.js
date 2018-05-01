import request from '../../general/request.js';

import readAccessToken from '../../auth/lightspeed/read-access-token.js'

export default async (dates) => {
  let access_token = await readAccessToken();
  const options = {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  };
  const apiUrl = `https://api.lightspeedapp.com/API/Account/159502/Reports/Accounting/PaymentsByDay.json?startDate=${dates.start}&endDate=${dates.end}`;
  return await request(apiUrl, options);
}
