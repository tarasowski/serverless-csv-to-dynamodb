module.exports = (event) => {
    if (!event || !event.Records || !Array.isArray(event.Records)) {
        return []
    }

    const extractMessage = record => record.body

    return event.Records.map(extractMessage)
}
