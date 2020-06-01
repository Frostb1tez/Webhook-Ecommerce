const admin = require('firebase-admin')
const db = admin.firestore();
var FieldValue = admin.firestore.FieldValue;

class Product {
  constructor (data) {
    this.id = data.product_id
    this.product_name = data.product_name
    this.product_type = data.product_type
    this.product_price = data.product_price
    this.product_image = data.product_image
    this.product_detail = data.product_detail
    this.product_stock = data.product_stock
  }

  async getdata () {
    try {
      let products = []
      let productsArray = []
      let i = 0
      var querySnapshot = await db.collection('product').get()
      querySnapshot.forEach(doc => {
        productsArray.push(doc.data())
        productsArray[i].id = doc.id
        products.push(productsArray[i])
        i++
      })
      return products
    } catch (e) {
      console.log(e)
      return e
    }
  }

  async getdatabyid (id) {
    try {
      var d = await db.collection('product').doc(id).get()
      return d.data()
    } catch (e) {
      console.log(e)
      return e
    }
  }

  async createproduct () {
    try {
      var d = await db.collection('product').doc(this.id).get()
      if (d.exists) {
        return false
      } else {
        db.collection('product').doc(this.id).set({
          product_id: this.id,
          product_name: this.product_name,
          product_type: this.product_type,
          product_price: this.product_price,
          product_image: this.product_image,
          product_detail: this.product_detail,
          product_stock: this.product_stock,
          timestamp: FieldValue.serverTimestamp()
        },{ merge: true })
        return true
      }
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async editproduct () {
    try {
      await db.collection('product').doc(this.id).set({
        product_id: this.id,
        product_name: this.product_name,
        product_type: this.product_type,
        product_price: this.product_price,
        product_image: this.product_image,
        product_detail: this.product_detail,
        product_stock: this.product_stock,
        timestamp: FieldValue.serverTimestamp()
      })
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async deleteproduct (id) {
    try {
      db.collection('product').doc(id).delete()
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

}

module.exports = Product