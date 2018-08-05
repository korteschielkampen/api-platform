const AWS = require('aws-sdk')

export default async (datatype, data) => {
  console.log(`---> Updating ${datatype} S3 start`)

  // Setup AWS
  AWS.config.update({
    region: 'us-east-1',
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
  })
  var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
  })

  // Create AWS send
  let json = JSON.stringify(data)
  var params = {
    Body: json,
    Bucket: 'integration-platform-data',
    Key: `${datatype}.json`,
  }

  // Put it in bucket
  try {
    data = await s3.putObject(params).promise()
    console.log(`---> Updating ${datatype} S3 done!`)
  } catch (err) {
    console.error(err)
  }

  // Return data for further use
  return await data
}
