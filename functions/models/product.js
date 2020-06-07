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

  async gettype () {
    try {
      let type = []
      let typeArr = []
      let i = 0
      var querySnapshot = await db.collection('producttype').get()
      querySnapshot.forEach(doc => {
        typeArr.push(doc.data())
        typeArr[i].id = doc.id
        type.push(typeArr[i])
        i++
      })
      return type
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

  async getdatabytype (type) {
    let data = []
    try {
      let d = await db.collection('product').where('product_type', '==', type).get()
      d.forEach(v => {
        data.push(v.data())
      })
      return data
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
          time_created: FieldValue.serverTimestamp(),
          time_updated: FieldValue.serverTimestamp()
        },{ merge: true })
        return true
      }
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async createproducttype () {
    try {
      var d = await db.collection('producttype').doc(this.product_type).get()
      if (d.exists) {
        return false
      } else {
        db.collection('producttype').doc(this.product_type).set({
          name: this.product_type,
          time_created: FieldValue.serverTimestamp(),
          time_updated: FieldValue.serverTimestamp()
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
        time_updated: FieldValue.serverTimestamp()
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

  async deleteproducttype (id) {
    try {
      db.collection('producttype').doc(id).delete()
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

}

module.exports = Product