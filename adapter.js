const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB()
const sqs = new AWS.SQS()
const uuidv4 = require('uuid/v4')

const TABLE_NAME = process.env.TABLE_NAME
const sqsQueueUrl = process.env.QUEUE_URL

module.exports.putItem = (messageBody) => {

    const params = {
        Item: {
            userId: {
                "S": uuidv4()
            },
            firstname: {
                "S": messageBody.firstname
            },
            lastname: {
                "S": messageBody.lastname
            },
            email: {
                "S": messageBody.email
            },
            date: {
                "S": messageBody.date
            },
            comment: {
                "S": messageBody.comment
            }
        },
        TableName: TABLE_NAME
    }

    return dynamodb.putItem(params).promise()
        .then(data => console.log('data was saved successfully'))
        .catch(err => console.log('something went wrong', err.stack))
}

module.exports.sendMessage = (streamingData) => {

    const params = {
        MessageBody: JSON.stringify(streamingData),
        QueueUrl: sqsQueueUrl,
    }

    return sqs.sendMessage(params).promise()
}
