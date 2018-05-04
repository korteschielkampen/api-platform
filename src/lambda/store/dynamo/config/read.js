const fetch = require('node-fetch')
const AWS = require('aws-sdk')

export default async params => {
  // Configure AWS
  AWS.config.update({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
  })
  AWS.config.update({ region: 'eu-central-1' })
  const ddb = new AWS.DynamoDB({ apiVersion: '2012-10-08' })
  const dcddb = new AWS.DynamoDB.DocumentClient()

  // Get request
  try {
    var data = await dcddb.get(params).promise()
    return data.Item
  } catch (err) {
    throw err
  }
}
