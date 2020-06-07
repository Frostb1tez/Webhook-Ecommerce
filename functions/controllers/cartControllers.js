const Cart = require('../models/cart')
const Message = require('../models/messegingAPI')
const Order = require('../models/order')

exports.getcart = async (req,res) => {
  const cart = new Cart(req.body)
  const data = await cart.getcart()
  if (data) {
    res.send({
      status: 200,
      message: 'success',
      data: data
    })
  } else {
    res.send({
      status: 200,
      message: 'not found cart',
      data: {
        product: [],
        totalPrice: 0
      }
    })
  }
}

exports.clearcart = async (req,res) => {
  const cart = new Cart(req.body)
  const data = await cart.clearcart()
  if (data === true) {
    res.send({
      status: 200,
      message: 'success'
    })
  } else {
    res.send({
      status: 404,
      message: 'fail'
    })
  }
}

exports.confirmcart = async (req,res) => {
  const cart = new Cart(req.body)
  const data = await cart.confirmcart()
  if (data === true) {
    res.send({
      status: 200,
      message: 'success'
    })
  } else {
    res.send({
      status: 404,
      message: 'fail'
    })
  }
}

exports.confirmorder = async (req,res) => {
  const cart = new Cart(req.body)
  const data = await cart.confirmorder()
  console.log(data.status)
  if (data.status === 1) {
    res.send({
      status: 200,
      success: 1,
      message: 'success'
    })
  } else if (data.status === 2) {
    res.send({
      status: 200,
      success: 0,
      message: 'already qo'
    })
  } else {
    res.send({
      status: 404,
      message: 'fail'
    })
  }
}

exports.confirmpayment = async (req,res) => {
  const cart = new Cart(req.body)
  const data = await cart.confirmpayment(req.query)
  const message = new Message()
  await message.pushMessage(`เลขคำสั่งซื้อของคุณคือ: ${data.info.transactionId}`, req.query.userId)
  res.send(data.returnMessage).status(200).end()
}

exports.gettotalorder = async (req,res) => {
  const order = new Order()
  let data = await order.getTotalOrder()
  if (data) {
    res.send({
      status: 200,
      message: 'success',
      data: data
    })
  } else {
    res.send({
      status: 404,
      message: 'not found orderid',
      data: data
    })
  }
}
