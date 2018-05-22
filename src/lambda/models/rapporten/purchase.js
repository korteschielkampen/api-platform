import _ from 'lodash'

export default () => {
  return {
    fields: [
      {
        title: 'Open: xx',
        value: 'orders: xx, atikelen: xx, waarde: €xxx.xx',
      },
      {
        title: 'Besteld: xx',
        value: 'orders: xx artikelen: xx, waarde: €xxx.xx',
      },
      {
        title: 'Check-In: xx',
        value: 'orders: xx, atikelen: xx, waarde: €xxx.xx',
      },
    ],
    color: '#ef3945',
    attachment_type: 'default',
    actions: [
      {
        name: 'Button',
        text: 'Open',
        type: 'button',
      },
      {
        name: 'Button',
        text: 'Besteld',
        type: 'button',
      },
      {
        name: 'Button',
        text: 'Check-In',
        type: 'button',
      },
    ],
  }
}
