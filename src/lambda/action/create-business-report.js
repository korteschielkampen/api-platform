import createMessage from '../api/slack/create-message.js'
import verkoopRapport from '../models/rapporten/verkoop.js'
import voorraadRapport from '../models/rapporten/voorraad.js'
import assortimentRapport from '../models/rapporten/assortiment.js'

export default async dayreport => {
  await createMessage(verkoopRapport(dayreport))
  await createMessage(voorraadRapport())
  await createMessage(assortimentRapport())
  return true
}
