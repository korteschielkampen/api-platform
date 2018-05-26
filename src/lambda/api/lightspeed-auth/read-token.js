import moment from 'moment'

import readDynamo from '../../store/dynamo/auth/read.js'
import updateDynamo from '../../store/dynamo/auth/update.js'
import refreshToken from './refresh-token.js'

export default async () => {
  let auth = await readDynamo('159502')

  // Check wether it's time to refresh
  if (
    !moment(auth.expires_by)
      .utc()
      .isAfter(
        moment()
          .utc()
          .add(30, 'seconds')
      )
  ) {
    console.log('Refreshing token')
    let token = await refreshToken(auth.refresh_token)
    let expires_by = moment()
      .utc()
      .add(token.expires_in, 'seconds')
      .format()

    // Check if the key returned is new
    if (auth.access_token !== token.access_token) {
      updateDynamo({
        ...auth,
        access_token: token.access_token,
        expires_by: expires_by,
      })
    }

    return token.access_token
  } else {
    return auth.access_token
  }
}
