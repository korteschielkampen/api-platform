import updateDynamo from '../config/update.js'

export default async auth => {
  console.log('Updating Dynamo Auth')
  var params = {
    TableName: 'auth',
    Item: {
      ...auth,
    },
  }
  return await updateDynamo(params)
}
