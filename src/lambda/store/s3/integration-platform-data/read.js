const AWS = require('aws-sdk')

export default async datatype => {
  console.log(`---> Reading ${datatype} S3 start`)

  // Setup AWS
  AWS.config.update({
    region: 'us-east-1',
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
  })
  var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
  })

  var params = {
    Bucket: 'integration-platform-data',
    Key: `${datatype}.json`,
    ResponseContentType: 'application/json',
  }

  // Put it in bucket
  let data
  try {
    let raw = await s3.getObject(params).promise()
    data = JSON.parse(raw.Body.toString('utf-8'))
    console.log(`---> Reading ${datatype} S3 done!`)
  } catch (err) {
    console.error(err)
  }

  // Return data for further use
  return await data
}
