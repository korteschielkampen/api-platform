import readDynamo from '../dynamo/read.js'
import updateDynamo from '../dynamo/update.js'
import refreshToken from './refresh-token.js'

export default async () => {
  let auth = await readDynamo("211688738215954171");
  let tokens = await refreshToken(auth.refresh_token);
  auth = {
    ...auth,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token
  };
  updateDynamo(auth);
  console.log("-----auth-------");
  console.log(auth);
  console.log("-----endauth-------");
  console.log("-----tokens-------");
  console.log(token);
  console.log("-----endtokens-------");
  return tokens.access_token;
}
