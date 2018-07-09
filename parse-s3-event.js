module.exports = (event) => {
    if (!event || !event.Records || !Array.isArray(event.Records)) {
        return []
    }
    const extractMessage = record => record.s3.object.key
    return event.Records.map(extractMessage)
}
