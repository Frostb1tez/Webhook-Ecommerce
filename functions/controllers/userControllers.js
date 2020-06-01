const User = require('../models/user')

exports.getinfo = async (req,res) => {
  const user = new User(req.body)
  const data = await user.getdata()
  if (data) {
    res.send({
      status: 200,
      message: 'success',
      data: data
    })
  } else {
    res.send({
      status: 200,
      message: 'dont found info',
      data: []
    })
  }
}

exports.adduser = async (req,res) => {
  const user = new User(req.body)
  const data = await user.adduser()
  if (data === true) {
    res.send({
      status: 200,
      message: 'success'
    })
  } else {
    res.send({
      status: 404,
      message: 'fail',
    })
  }
}

exports.addinfo = async (req,res) => {
  const user = new User(req.body)
  const data = await user.addinfo()
  if (data === true) {
    res.send({
      status: 200,
      message: 'success'
    })
  } else {
    res.send({
      status: 404,
      message: 'fail',
    })
  }
}

exports.checkuser = async (req,res) => {
  const user = new User(req.body)
  const data = await user.checkuser()
  if (data === true) {
    res.send({
      status: 200,
      isMember: 1,
      message: 'is member'
    })
  } else if (data === false) {
    res.send({
      status: 200,
      isMember: 0,
      message: 'is not member'
    })
  } else {
    res.send({
      status: 404,
      message: 'fail',
    })
  }
}