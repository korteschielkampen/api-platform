import readDynamo from '../config/read.js'

export default async (account_id) => {
  var params = {
    TableName: 'lightspeed-to-moneybird',
    Key: {
      "account_id": account_id,
    }
  };
  return await readDynamo(params);

}
