import request from '../general/request.js'
import readAccessToken from '../moneybird-auth/read-token.js'

export default async (mutation_id, booking) => {
  let access_token = await readAccessToken()
  const options = {
    method: 'PATCH',
    body: JSON.stringify(booking),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  }
  const apiUrl = `https://moneybird.com/api/v2/211688738215954171/financial_mutations/${mutation_id}/link_booking.json`

  return await request(apiUrl, options)
}
