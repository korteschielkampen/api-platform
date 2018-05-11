import createMessage from '../api/slack/create-message.js'

export default async () => {
  const formattedMessage = {
    text: 'Haiiiii, ik ben een nieuwe afleiding voor u.',
    channel: 'CAPCPRW6B',
    icon_url:
      'https://integration-platform.korteschielkampen.nl/lightspeed.png',
    attachments: [
      {
        title: 'Wat vind u van nog meer afleidingen in uw leven?',
        callback_id: 'comic_1234_xyz',
        color: '#3AA3E3',
        attachment_type: 'default',
        actions: [
          {
            name: 'Yes',
            text: 'Ja, geniet ervan',
            type: 'button',
            value: 'yes',
          },
          {
            name: 'No',
            text: 'Nee, niet nog één, asjeblieft zeg',
            type: 'button',
            value: 'no',
          },
        ],
      },
    ],
  }

  return await createMessage(formattedMessage)
}
