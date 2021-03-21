const { sendCalculateScore } = require('./senders')
const cache = require('../cache')

module.exports = async function (msg, projectDetailsReceiver) {
  try {
    const { body, correlationId } = msg
    console.log('Received project details message:')
    console.log(body)
    console.log(correlationId)

    await cache.setProjectDetails(correlationId, body)

    await sendCalculateScore({ test: 'Calculate the desirability' }, correlationId)

    await projectDetailsReceiver.completeMessage(msg)
  } catch (err) {
    console.error('Unable to process message')
    console.error(err)
    await projectDetailsReceiver.abandonMessage(msg)
  }
}
