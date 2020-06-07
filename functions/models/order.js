const admin = require('firebase-admin')
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

class Order {
  constructor () {
  }
  async getTotalOrder() {
    try{
      let d = await db.collection('so').get()
      let data = d.docs.map(doc => ({id:doc.id,data:doc.data()}))
      return data
    } catch (e) {
      console.log(e)
      return e
    }
  }
}

module.exports = Order