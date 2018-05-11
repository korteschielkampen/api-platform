import updateDynamo from '../config/update.js'

export default async auth => {
  var params = {
    TableName: 'auth',
    Item: {
      ...auth,
    },
  }
  return await updateDynamo(params)
}
