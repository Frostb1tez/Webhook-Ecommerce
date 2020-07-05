const Promotion = require('../models/promotion')
const e = require('express')

exports.createpromotion = async (req,res) => {
  const promotion = new Promotion()
  const data = await promotion.createPromotion(req.body)
  if (data === true) {
    res.send({
      status: 200,
      message: 'Completed'
    })
  } else {
    res.send({
      status: 404,
      message: 'False'
    })
  }
}

exports.getpromotion = async (req,res) => {
  const promotion = new Promotion()
  const data = await promotion.getPromotion()
  if (data) {
    res.send({
      status: 200,
      message: 'Completed',
      data: data
    })
  } else {
    res.send({
      status: 404,
      message: 'Already Promotion'
    })
  }
}

exports.deletepromotion = async (req,res) => {
  const promotion = new Promotion()
  const data = await promotion.delPromotion(req.body)
  if (data === true) {
    res.send({
      status: 200,
      message: 'Completed'
    })
  } else {
    res.send({
      status: 404,
      message: 'False'
    })
  }
}