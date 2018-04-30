import readDynamo from '../dynamo/read.js'
import updateDynamo from '../dynamo/update.js'
import refreshTokens from './refresh-tokens.js'

export default async () => {
  let authData = await readDynamo("159502");
  let tokens = await refreshTokens(authData.refresh_token);
  if (authData.access_token !== tokens.access_token) {
    updateDynamo({...authData, access_token: tokens.access_token});
  }
  return tokens.access_token;
}
