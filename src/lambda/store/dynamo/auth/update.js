import updateDynamo from '../config/update.js'

export default async (auth) => {
  var params = {
    TableName: 'lightspeed-to-moneybird',
    Item: {
      ...auth
    }
  };
  return await updateDynamo(params);
}
