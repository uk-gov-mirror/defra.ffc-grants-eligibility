const msgCfg = require('../config/messaging')
const { MessageReceiver } = require('ffc-messaging')

let projectDetailsReceiver
let contactDetailsReceiver
let desirabilityScoreReceiver

async function stop () {
  await projectDetailsReceiver.closeConnection()
  await contactDetailsReceiver.closeConnection()
  await desirabilityScoreReceiver.closeConnection()
}

process.on('SIGTERM', async () => {
  await stop()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await stop()
  process.exit(0)
})

module.exports = {
  startProjectDetailsReceiver: async function (projectDetailsReceived) {
    const updateAction = msg => projectDetailsReceived(msg, projectDetailsReceiver)
    projectDetailsReceiver = new MessageReceiver(msgCfg.projectDetailsQueue, updateAction)
    await projectDetailsReceiver.subscribe()
  },
  startContactDetailsReceiver: async function (contactDetailsReceived) {
    const updateAction = msg => contactDetailsReceived(msg, contactDetailsReceiver)
    contactDetailsReceiver = new MessageReceiver(msgCfg.contactDetailsQueue, updateAction)
    await contactDetailsReceiver.subscribe()
  },
  startDesirabilityScoreReceiver: async function (desirabilityScoreReceived) {
    const updateAction = msg => desirabilityScoreReceived(msg, desirabilityScoreReceiver)
    desirabilityScoreReceiver = new MessageReceiver(msgCfg.desirabilityScoreSubscription, updateAction)
    await desirabilityScoreReceiver.subscribe()
  }
}
