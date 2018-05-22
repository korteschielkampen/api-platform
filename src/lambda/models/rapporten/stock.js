export default () => {
  return {
    text: `*Voorraad*: Orden artikelen met`,
    color: '#ef3945',
    attachment_type: 'default',
    actions: [
      {
        name: 'Button',
        text: 'Nabestellen',
        type: 'button',
      },
    ],
  }
}
