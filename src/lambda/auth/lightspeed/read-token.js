import readDynamo from '../dynamo/read.js'
import updateDynamo from '../dynamo/update.js'
import refreshToken from './refresh-token.js'

export default async () => {
  let auth = await readDynamo("159502");
  let token = await refreshToken(auth.refresh_token);
  if (auth.access_token !== token.access_token) {
    updateDynamo({...auth, access_token: token.access_token});
  }
  return token.access_token;
}
