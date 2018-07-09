const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const sqs = new AWS.SQS()
const parse = require('fast-csv')
const queue = require('./adapter')
const parseS3Event = require('./parse-s3-event')

const BUCKET_NAME = process.env.BUCKET_NAME

const createStream = (objectKey) => {

    return s3.getObject({
            Bucket: BUCKET_NAME,
            Key: objectKey
        })
        .createReadStream()
}

// check the difference between async and callback
exports.handler = (event, context, callback) => {

    const objectKey = parseS3Event(event)
    const s3Stream = objectKey.map(createStream)[0]

    parse.fromStream(s3Stream)
        .on('data', streamingData => {
            queue.sendMessage(streamingData)
                .then(data => console.log('successfully sent to queue', data))
                .catch(err => console.log('something went wrong', err))
        })

    callback(null, "success")
}
