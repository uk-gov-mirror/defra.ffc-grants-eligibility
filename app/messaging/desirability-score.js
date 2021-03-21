const cache = require('../cache')

module.exports = async function (msg, desirabilityScoreReceiver) {
  try {
    const { body, correlationId } = msg
    console.log('Received desirability score message:')
    console.log(body)
    console.log(correlationId)

    await cache.setDesirabilityScore(correlationId, body)

    await desirabilityScoreReceiver.completeMessage(msg)
  } catch (err) {
    console.error('Unable to process message')
    console.error(err)
    await desirabilityScoreReceiver.abandonMessage(msg)
  }
}
