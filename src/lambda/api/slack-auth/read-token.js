import readDynamo from '../../store/dynamo/auth/read.js'
import updateDynamo from '../../store/dynamo/auth/update.js'

export default async () => {
  let auth = await readDynamo('korteschiel-3')
  return auth.access_token
}
