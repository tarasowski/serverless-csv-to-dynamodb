const parseSQSEvent = require('./parse-sqs-event')
const db = require('./adapter')

exports.handler = async(event) => {

    const messageBody = parseSQSEvent(event)

    return Promise.all(messageBody.map(db.putItem))

}
