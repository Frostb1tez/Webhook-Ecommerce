const admin = require('firebase-admin')
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

class Promotion {
  constructor () {
  }
  async createPromotion (d) {
    let self = this
    let { product_id, discount_type, discount_price, start_date, end_date } = d
    try {
      let d = await self.checkdatePromotion(product_id,start_date)
      if (d === false) {  //true = can create
        return false
      } else {
        await db.collection('product').doc(product_id).set({
          isPromotion: 1
        },{ merge: true })
        db.collection('promotion').doc(product_id).set({
          product_id: product_id,
          discount_type: discount_type,
          discount_price: discount_price,
          start_date: start_date,
          end_date: end_date,
          time_created: FieldValue.serverTimestamp()
        },{ merge: true })
        return true
      }
    } catch (e) {
      console.log(e)
      return false
    }
  }
  ////////////////////////////////////////////////////////////////////
  async checkdatePromotion (product_id,start_date) {
    try {
      let d = await db.collection('promotion').where('end_date', '>', start_date).where('product_id', '==', product_id).get()
      let data = d.docs.map(doc => {
        return {
          id: doc.id,
          data: doc.data()
        }
      })
      if (data.length !== 0) { //if have data can't create
        return false
      } else {
        return true
      }
    } catch (e) {
      console.log(e)
      return false
    }
  }
  ///////////////////////////////////////////////////////////////////
  async getPromotion () {
    try {
      let d = await db.collection('promotion').get()
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
  ///////////////////////////////////////////////////////////////////
  async delPromotion (d) {
    let { product_id } = d
    try {
      await db.collection('product').doc(product_id).set({
        isPromotion: 0
      },{ merge: true })
      await db.collection('promotion').doc(product_id).delete()
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}

module.exports = Promotion