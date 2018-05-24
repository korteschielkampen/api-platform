import fs from 'fs'

import request from '../general/request.js'
import readAccessToken from '../slack-auth/read-token.js'

import { WebClient } from '@slack/client'

export default async (mess, channel) => {
  // An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
  let token = await readAccessToken()
  const web = new WebClient(token)

  // Slack needs a file name for the upload
  // This file is located in the current directory (`process.pwd()`)
  const filename = 'colorbar.png'

  // See: https://api.slack.com/methods/chat.postMessage
  web.files
    .upload({
      filename,
      // You can use a ReadableStream or a Buffer for the file option
      file: fs.createReadStream(`./${filename}`),
      // Or you can use the content property (but not both)
      // content: 'plain string content that will be editable in Slack'
    })
    .then(res => {
      // `res` contains information about the uploaded file
      console.log('File uploaded: ', res.file.id)
    })
    .catch(console.error)

  return 'hi'
}
