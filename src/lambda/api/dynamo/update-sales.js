import updateDynamo from '../../general/dynamo/update.js'

export default async (sales, date) => {
  _.each(sales, (sale)=>{
    _.each(sale, (value, key)=>{
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
  await updateDynamo(salesDay);
  return salesDay.Item;
}
