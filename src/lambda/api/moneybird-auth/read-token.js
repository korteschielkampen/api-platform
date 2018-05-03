import readDynamo from '../../store/dynamo/auth/read.js'
import updateDynamo from '../../store/dynamo/auth/update.js'
import refreshToken from './refresh-token.js'

export default async () => {
  let auth = await readDynamo("211688738215954171");

  // Updating tokens for our scope not needed, no timeout

  // let tokens = await refreshToken(auth.refresh_token);
  // auth = {
  //   ...auth,
  //   access_token: tokens.access_token,
  //   refresh_token: tokens.refresh_token
  // };
  // updateDynamo(auth);

  return auth.access_token;
}
