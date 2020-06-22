const admin = require('firebase-admin')
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;
const LinePay = require("./linePayService")

class Cart {
  constructor (data) {
    this.id = data.tokenId
    this.totalPrice = data.totalPrice
    this.cart = data.cart
    this.contact = data.contact
    this.address = data.address
  }
  async getcart () {
    try{
      var d = await db.collection('users').doc(this.id).collection('cart').doc(this.id).get()
      return d.data()
    } catch (e) {
      console.log(e)
      return e
    }
  }

  async clearcart () {
    try {
      var d = await db.collection('users').doc(this.id).collection('cart').doc(this.id).delete()
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async confirmcart () {
    try {
      var d = await db.collection('users').doc(this.id).collection('cart').doc(this.id).set({
        product: this.cart.product,
        totalPrice: this.totalPrice
      }, { merge: true })
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async confirmorder () {
    try {
      let d = await db.collection('users').doc(this.id).collection('qo').get()
      let orderid = d.docs.map(doc => doc.id)
      if (orderid.length === 1) {
        let data = {
          status: 2,
          data: 'Already QO'
        }
        return data
      } else {
        await db.collection('users').doc(this.id).collection('cart').doc(this.id).delete()
        await db.collection('users').doc(this.id).collection('qo').doc().set({
          product: this.cart.product,
          totalPrice: this.totalPrice,
          contact: this.contact,
          address: this.address
        }, { merge: true })
        let data = {
          status: 1,
          data: 'Completed'
        }
        return data
      }
    } catch (e) {
      let data = {
        status: 0
      }
      return data
    }
  }
  async confirmpayment (query) {
    try {
      const linePay = new LinePay({
        channelId: process.env.LINE_PAY_CHANNEL_ID,
        channelSecret: process.env.LINE_PAY_CHANNEL_SECRET,
        uri: 'https://sandbox-api-pay.line.me'
      })
      const body = {
        amount: query.amount,
        currency: 'THB'
      }
      let d = await linePay.confirm(body, query.transactionId)
      if (d.returnCode === '0000') {
        const userId = query.userId
        const orderId = query.orderId
        this.qotoSo(userId,orderId,d.info)
        return d
      } else {
        return d
      }
    } catch (e) {
      console.log(e)
      return e
    }
  }
  async qotoSo (userId, orderId,info) {
    const transactionId = info.transactionId.toString()
    const totalPrice = info.packages[0].amount
    const product = info.packages[0].products
    try {
      product.forEach(v => {
        db.collection('product').doc(v.id).update({
          sales: FieldValue.increment(v.quantity),
          product_stock: FieldValue.increment(-v.quantity)
        })
      })
      await db.collection('users').doc(userId).collection('qo').doc(orderId).delete()
      await db.collection('users').doc(userId).collection('so').doc(transactionId).set({
        product: product,
        totalPrice: totalPrice
      }, { merge: true })
      await db.collection('so').doc(transactionId).set({
        trackingId: 'กำลังอยู่ในระหว่างการจัดเตรียมสินค้า',
        tokenId: userId,
        product: product,
        totalPrice: totalPrice
      }, { merge: true })
    } catch (e) {
      console.log(e)
    }
  }
}
  

module.exports = Cart