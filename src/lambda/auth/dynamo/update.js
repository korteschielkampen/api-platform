import updateDynamo from '../../general/dynamo/update.js'

export default async (auth) => {
  var params = {
    TableName: 'lightspeed-to-moneybird',
    Item: {
      ...auth
    }
  };
  return await updateDynamo(params);
}
