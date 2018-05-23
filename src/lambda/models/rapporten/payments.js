import _ from 'lodash'

export default dayreport => {
  const totalEarnings = parseFloat(
    parseFloat(dayreport.payments.cash.amount) +
      parseFloat(dayreport.payments.pin.amount) +
      parseFloat(dayreport.payments.gift.amount) +
      parseFloat(dayreport.payments.credit.amount)
  ).toFixed(0)

  return {
    fields: [
      {
        title: 'Betalingen:',
        value: `Contant: €${parseFloat(dayreport.payments.cash.amount).toFixed(
          0
        )}\nPIN: €${parseFloat(dayreport.payments.pin.amount).toFixed(
          0
        )}\nCadeau: €${parseFloat(dayreport.payments.gift.amount).toFixed(
          0
        )}\nKrediet: €${parseFloat(dayreport.payments.credit.amount).toFixed(
          0
        )}`,
        short: true,
      },
      // {
      //   title: 'Boekhouding:',
      //   value:
      //     'Credite.: €xxx.xx\nDebite.: €xxx.xx\nKas: €xxx.xx\nBank: €xxx.xx\nToekomst: €xxx.xx',
      //   short: true,
      // },
    ],

    color: '#ef3945',
    attachment_type: 'default',
    // actions: [
    //   {
    //     name: 'Button',
    //     text: 'Voeg kasstorting toe',
    //     type: 'button',
    //   },
    // ],
  }
}
