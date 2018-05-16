import createMessage from '../api/slack/create-message.js'
import verkoopRapport from '../models/rapporten/verkoop.js'
import voorraadRapport from '../models/rapporten/voorraad.js'
import assortimentRapportArchief from '../models/rapporten/assortiment-archiveren.js'
import assortimentRapportNieuw from '../models/rapporten/assortiment-nieuw.js'
import marketingRapport from '../models/rapporten/marketing.js'

export default async dayreport => {
  await createMessage(verkoopRapport(dayreport))
  // await createMessage(voorraadRapport())
  // await createMessage(assortimentRapport())
  // await createMessage(marketingRapport())
  return true
}
