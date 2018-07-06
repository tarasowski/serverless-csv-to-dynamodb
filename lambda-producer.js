const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const sqs = new AWS.SQS()
const parse = require('fast-csv')

const sqsQueueUrl = process.env.QUEUE_URL
const bucketName = process.env.BUCKET_NAME

exports.handler = async(event, context, callback) => {

    const objectKey = event.Records[0].s3.object.key
    const s3Stream = s3.getObject({ Bucket: bucketName, Key: objectKey }).createReadStream()

    parse.fromStream(s3Stream)
        .on('data', (data) => {
            const structure = {
                firstname: data[0],
                lastname: data[1],
                email: data[2],
                date: data[3],
                comment: data[4]
            }

            const params = {
                MessageBody: JSON.stringify(structure),
                QueueUrl: sqsQueueUrl,
            }

            sqs.sendMessage(params, (err, data) => {
                if (err) console.log(err, err.stack)
                else console.log(data)
            })



        })

    callback(null, { message: 'Hello from Lambda' })
}
