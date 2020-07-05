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
      let d = await db.collection('product').get()
      let data = d.docs.map(doc => {
        return doc.data()
      })
      return data
    } catch (e) {
      console.log(e)
      return e
    }
  }

  async checkDate (id,price) {
    let date = new Date().toISOString().slice(0,10).replace(/-/g, "/")
    try {
      let d = await db.collection('promotion').doc(id).get()
      if (d.data().end_date >= date && d.data().start_date <= date) {
        if (d.data().discount_type === '%') {
          return price - (price * d.data().discount_price/100)
        } else if (d.data().discount_type === 'THB') {
          return price - d.data().discount_price
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  async gettype () {
    try {
      let d = await db.collection('producttype').get()
      let data = d.docs.map(doc => {
        return {
          id: doc.id,
          data: doc.data()
        }
      })
      return data
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
          isPromotion: 0,
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
      if (this.product_image === '') {
        await db.collection('product').doc(this.id).set({
          product_id: this.id,
          product_name: this.product_name,
          product_type: this.product_type,
          product_price: this.product_price,
          product_detail: this.product_detail,
          product_stock: this.product_stock,
          time_updated: FieldValue.serverTimestamp()
        },{ merge: true })
      } else {
        await db.collection('product').doc(this.id).set({
          product_id: this.id,
          product_name: this.product_name,
          product_type: this.product_type,
          product_price: this.product_price,
          product_image: this.product_image,
          product_detail: this.product_detail,
          product_stock: this.product_stock,
          time_updated: FieldValue.serverTimestamp()
        },{ merge: true })
      }
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