const { WebhookClient, Payload } = require('dialogflow-fulfillment');
const Message = require('../models/messegingAPI')
exports.webhook = async (req,res) =>{
  const agent = new WebhookClient({ request: req, response: res })
  const message = new Message(req)
  function getProduct(agent) {
    return message.getproduct()
    .then(d => {
      let payload = new Payload(`LINE`, d, { sendAsMessage: true });
      agent.add(payload)
    })
  }

  function getOrder (agent) {
    const userId = agent.originalRequest.payload.data.source.userId
    return message.getorder(userId)
    .then(d => {
      if (d.status === 404) {
        agent.add(d.messege)
      } else {
        let payload = new Payload(`LINE`, d, { sendAsMessage: true });
        agent.add(payload)
      }
    })
  }

  function getHistory (agent) {
    const userId = agent.originalRequest.payload.data.source.userId
    return message.getHistory(userId)
    .then(d => {
      if (d.status === 404) {
        agent.add(d.messege)
      } else {
        let payload = new Payload(`LINE`, d, { sendAsMessage: true });
        agent.add(payload)
      }
    })
  }

  let intentMap = new Map()
  intentMap.set('Product', getProduct)
  intentMap.set('Order', getOrder)
  intentMap.set('History', getHistory)
  agent.handleRequest(intentMap)
}