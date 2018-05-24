import fs from 'fs'
import { promisify } from 'util'

import request from '../general/request.js'
import readAccessToken from '../slack-auth/read-token.js'

import { WebClient } from '@slack/client'
const p = promisify(WebClient)

export default async (mess, channel) => {
  // An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
  let token = await readAccessToken()
  const web = new WebClient(token)

  // Slack needs a file name for the upload
  // This file is located in the current directory (`process.pwd()`)
  const filename = 'colorbar.png'

  // See: https://api.slack.com/methods/chat.postMessage
  let upload = promisify(web.files.upload)
  let res = await upload({
    filename,
    file: fs.createReadStream(`./${filename}`),
    channels: channel,
  })

  return res
}
