const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB()

const tableName = process.env.TABLE_NAME

exports.handler = async(event) => {

    const body = JSON.parse(event.Records[0].body)

    const params = {
        Item: {
            firstname: {
                "S": body.firstname
            },
            lastname: {
                "S": body.lastname
            },
            email: {
                "S": body.email
            },
            date: {
                "S": body.date
            },
            comment: {
                "S": body.comment
            }
        },
        TableName: tableName
    }

    return dynamodb.putItem(params).promise()
        .then(data => console.log('data added to db'))
        .catch(err => console.log('something went wrong', err.stack))

};
