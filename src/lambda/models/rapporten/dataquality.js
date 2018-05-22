export default () => {
  return {
    text: `*Datakwaliteit*: Orden artikelen met`,
    color: '#ef3945',
    attachment_type: 'default',
    actions: [
      {
        name: 'Button',
        text: 'Categoriseren',
        type: 'button',
      },
      {
        name: 'Button',
        text: 'Nieuwigheid',
        type: 'button',
      },
      {
        name: 'Button',
        text: 'Archiveren',
        type: 'button',
      },
    ],
  }
}
