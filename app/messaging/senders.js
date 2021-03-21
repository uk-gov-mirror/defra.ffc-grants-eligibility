const { MessageSender } = require('ffc-messaging')
const msgCfg = require('../config/messaging')

const calculateScoreSender = new MessageSender(msgCfg.calculateScoreQueue)
const desirabilitySubmittedSender = new MessageSender(msgCfg.desirabilitySubmittedTopic)

async function stop () {
  await calculateScoreSender.closeConnection()
  await desirabilitySubmittedSender.closeConnection()
}

process.on('SIGTERM', async () => {
  await stop()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await stop()
  process.exit(0)
})

async function sendMsg (sender, msgData, msgType) {
  const msg = {
    type: msgType,
    source: msgCfg.msgSrc,
    ...msgData
  }

  console.log('sending message', msg)

  await sender.sendMessage(msg)
}

module.exports = {
  sendCalculateScore: async function (calculateScoreData, correlationId) {
    await sendMsg(calculateScoreSender, { body: calculateScoreData, correlationId }, msgCfg.calculateScoreMsgType)
  },
  sendDesirabilitySubmitted: async function (desirabilitySubmittedData) {
    await sendMsg(desirabilitySubmittedSender, { body: desirabilitySubmittedData }, msgCfg.desirabilitySubmittedMsgType)
  }
}
