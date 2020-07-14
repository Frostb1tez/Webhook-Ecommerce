const Product = require('../models/product')
const Busboy = require('busboy')
const path = require('path');
const os = require('os');
const fs = require('fs');
const admin = require('firebase-admin')
const bucket = admin.storage().bucket('finalproject-9b5e9.appspot.com')
const UUID = require("uuid")
const uuid = UUID()

exports.getproducts =  async (req, res) => {
  const product = new Product(req.body)
  let data = await product.getdata()
  if (data) {
    for (v of data) {
      if(v.isPromotion === 1) {
        let result = await product.checkDate(v.product_id,v.product_price)
        if (result) {
          v.oldPrice = v.product_price
          v.product_price = result
        }
      }
    }
    res.send({
      status: 200,
      message: 'success',
      data: data
    })
  } else {
    res.send({
      status: 404,
      message: 'fail',
      data: data
    })
  }
}

exports.getproductstype =  async (req, res) => {
  const product = new Product(req.body)
  const data = await product.gettype()
  if (data) {
    res.send({
      status: 200,
      message: 'success',
      data: data
    })
  } else {
    res.send({
      status: 404,
      message: 'fail',
      data: data
    })
  }
}

exports.getproductbyid = async (req, res) => {
  const product = new Product(req.body)
  let data = await product.getdatabyid(req.params.id)
  if (data) {
    if(data.isPromotion === 1) {
      let result = await product.checkDate(data.product_id,data.product_price)
      if (result) {
        data.oldPrice = data.product_price
        data.product_price = result
      }
    }
    res.send({
      status: 200,
      message: 'success',
      data: data
    })
  } else {
    res.send({
      status: 404,
      message: 'fail',
      data: data
    })
  }
}

exports.getproductbytype = async (req, res) => {
  const product = new Product(req.body)
  const data = await product.getdatabytype(req.params.type)
  if (data.length != 0) {
    res.send({
      status: 200,
      message: 'success',
      data: data
    })
  } else {
    res.send({
      status: 404,
      message: 'type not found',
      data: data
    })
  }
}

exports.createproduct = async (req ,res) =>{

  const product = new Product(req.body)
  const data = await product.createproduct()
  if (data === true) {
    res.send({
      status: 200,
      message: 'success',
    })
  } else {
    res.send({
      status: 404,
      message: 'fail',
    })
  }
}

exports.createproducttype = async (req ,res) =>{
  const product = new Product(req.body)
  const data = await product.createproducttype()
  if (data === true) {
    res.send({
      status: 200,
      message: 'success',
    })
  } else {
    res.send({
      status: 404,
      message: 'fail',
    })
  }
} 

exports.editproduct = async (req ,res) => {
  const product = new Product(req.body)
  const data = await product.editproduct()
  if (data === true) {
    res.send({
      status: 200,
      message: 'success',
    })
  } else {
    res.send({
      status: 404,
      message: 'fail',
    })
  }
}

exports.deleteproduct = async (req , res) => {
  const product = new Product(req.body)
  const data = await product.deleteproduct(req.body.id)
  if (data === true) {
    res.send({
      status: 200,
      message: 'success',
    })
  } else {
    res.send({
      status: 404,
      message: 'fail',
    })
  }
}

exports.deleteproducttype = async (req , res) => {
  const product = new Product(req.body)
  const data = await product.deleteproducttype(req.body.id)
  if (data === true) {
    res.send({
      status: 200,
      message: 'success',
    })
  } else {
    res.send({
      status: 404,
      message: 'fail',
    })
  }
}

exports.uploadimage = async (req , res) => {
  if (req.method === 'POST') {
    const busboy = new Busboy({ headers: req.headers });
    const uploads = {}
    
    // This callback will be invoked for each file uploaded
    busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
        // console.log(`File [${fieldname}] filename: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`);
        const filepath = path.join(os.tmpdir(), filename)
        uploads[fieldname] = { file: filepath }
        // console.log(`Saving '${fieldname}' to ${filepath}`);
        try {
          await this.dofs(file,filepath)
          let d = await bucket.upload(filepath, {
            destination: `${filename}`,
            metadata: {
              cacheControl: 'no-cache'
            } 
          })
          res.send({
            status: 200,
            urlImage: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(d[0].name)}?alt=media&token=${uuid}`
          })
          fs.unlinkSync(filepath)
        } catch (e) {
          res.send({
            status: 500,
            message: e
          })
          fs.unlinkSync(filepath)
        }
    });
    busboy.end(req.rawBody);
  } else {
      res.status(405).end();
  }
}

exports.dofs = async (d1,d2) => {
  d1.pipe(fs.createWriteStream(d2))
}