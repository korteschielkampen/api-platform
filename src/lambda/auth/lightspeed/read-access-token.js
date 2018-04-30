import readDynamo from '../dynamo/read.js'
import updateDynamo from '../dynamo/update.js'
import refreshTokens from './refresh-tokens.js'

export default async () => {
  let auth = await readDynamo("159502");
  let tokens = await refreshTokens(auth.refresh_token);
  if (auth.access_token !== tokens.access_token) {
    updateDynamo({...auth, access_token: tokens.access_token});
  }
  return tokens.access_token;
}
