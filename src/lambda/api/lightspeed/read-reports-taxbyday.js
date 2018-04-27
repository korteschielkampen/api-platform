const fetch = require('node-fetch');

export default async (access_token, dates) => {
  const options = {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  };
  const apiUrl = `https://api.lightspeedapp.com/API/Account/159502/Reports/Accounting/TaxClassSalesByDay.json?startDate=${dates.start}&endDate=${dates.end}`;

  const res = await fetch(apiUrl, options);
  if (!res.ok) {throw await res.json();}
  return await res.json();
}
