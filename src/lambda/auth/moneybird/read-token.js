import readDynamo from '../dynamo/read.js'
import updateDynamo from '../dynamo/update.js'
import refreshToken from './refresh-token.js'

export default async () => {
  let auth = await readDynamo("211688738215954171");
  let token = await refreshToken(auth.refresh_token);
  auth = {
    ...auth,
    access_token: token.access_token,
    refresh_token: token.refresh_token
  };
  updateDynamo(auth);
  console.log(auth);
  return token.access_token;
}
