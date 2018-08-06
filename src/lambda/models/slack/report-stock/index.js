import createAlgorithmReport from './algorithm.js'

export default (data, channel) => {
  return {
    text: 'Algoritme updates:',
    channel: channel,
    attachments: createAlgorithmReport(data),
  }
}
