const express = require('express')
const app = express()
const Message = require('../models/messegingAPI')

exports.webhook = async (req,res) =>{
  const message = new Message(req)
  let event = req.body.events[0]
  const userId = event.source.userId
  switch (event.type) {
    case 'message' :
      if (event.message.text === '#admin') {
        message.changeRichmenu(userId,event.replyToken)
      } else if (event.message.text === '#user') {
        message.deleteRichmenu(userId,event.replyToken)
      } else {
        await message.postToDialogflow()
      }
      res.sendStatus(200)
    break
    case 'postback' :
      const data = event.postback.data.split('/')
      const action = data[0]
      const query = data[1]
      const urlParams = new URLSearchParams(query)
      const orderId = urlParams.get('orderId')
      const trackingId = urlParams.get('trackingId')
      if (action === 'cancelorder') {
        let d = await message.cancelOrder(orderId,userId)
      } else if (action === 'confirmpayment') {
        let d = await message.reservePayment(orderId, userId)
      } else if (action === 'history') {
        const soId = urlParams.get('saleorderId')
        message.getHistoryDetail(soId,userId)
      } else if (action === 'tracking') {
        // let d = await message.reservePayment(orderId, userId)
        if (trackingId !== 'กำลังอยู่ในระหว่างการจัดเตรียมสินค้า') {
          let d = await message.tracking(trackingId)
          message.sendPayload(d,event.replyToken)
        } else {
          message.sendMessage(trackingId,event.replyToken)
        }
      }
      res.sendStatus(200)
    break
    default :
    res.sendStatus(404)
  }
}
