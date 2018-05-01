import readDynamo from '../../general/dynamo/read.js'

export default async (date) => {
  let params = {
    TableName: 'lightspeed-sales-day',
    Key: {
      "timeStamp": date,
    }
  };
  return await readDynamo(params);

}
