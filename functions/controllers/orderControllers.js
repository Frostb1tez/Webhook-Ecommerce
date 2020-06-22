const Order = require('../models/order')

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

exports.editTrackOrderId = async (req,res) => {
  const order = new Order()
  let data = await order.editTrackID(req.body.soId,req.body.trackId)
  if (data === true) {
    res.send({
      status: 200,
      message: 'update trackid success'
    })
  } else {
    res.send({
      status: 404,
      message: 'fail'
    })
  }
}