import updateDynamo from '../../general/dynamo/update.js'

export default async (sales, date) => {
  _.each(sales, (sale)=>{
    _.each(sale, (value, key)=>{
      console.log(key, ": ", value)
      if (value === "" || value === null) {
        delete sale[key];
      }
    })
  })

  let salesDay = {
    TableName: 'lightspeed-sales-day',
    Item: {
      timeStamp: date,
      sales: sales
    }
  };
  await updateDynamo(params);
  return salesDay.Item;
}
