export default () => {
  return {
    text: `*Datakwaliteit*: Orden artikelen met`,
    color: '#ef3945',
    attachment_type: 'default',
    actions: [
      {
        name: 'Button',
        text: 'Verkocht',
        type: 'button',
      },
      {
        name: 'Button',
        text: 'Toegevoegd',
        type: 'button',
      },
      {
        name: 'Button',
        text: 'Archiveerbaar',
        type: 'button',
      },
    ],
  }
}
