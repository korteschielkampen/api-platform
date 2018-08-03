import createAlgorithmReport from './algorithm.js'

export default (data, channel) => {
  return {
    text: 'Inkooprapport',
    channel: channel,
    attachments: createAlgorithmReport(data),
  }
}
