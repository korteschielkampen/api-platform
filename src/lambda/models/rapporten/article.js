export default () => {
  return {
    text: `*Inzicht*: Orden artikelen met`,
    color: '#ef3945',
    attachment_type: 'default',
    actions: [
      {
        name: 'Button',
        text: 'Aantal',
        type: 'button',
      },
      {
        name: 'Button',
        text: 'Omzet',
        type: 'button',
      },
      {
        name: 'Button',
        text: 'Winstgevendheid',
        type: 'button',
      },
    ],
  }
}
