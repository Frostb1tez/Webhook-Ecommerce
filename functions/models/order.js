const admin = require('firebase-admin')
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

class Order {
  constructor () {
  }
  async getTotalOrder() {
    let self = this
    try{
      let d = await db.collection('so').orderBy("time_created", "desc").get()
      let data = await Promise.all(d.docs.map(async (doc) => {
        return {
          id:doc.id,
          contact: await self.getContact(doc.data().tokenId),
          data:doc.data()
        }
      }))
      return data
    } catch (e) {
      console.log(e)
      return e
    }
  }
  ///////////////////////////////////////////////////////////////////////
  async getContact (userId) {
    try {
      let contact = await db.collection('users').doc(userId).get()
      let {firstname,lastname} = contact.data().name
      let {address,amphoe,district,province,zipcode} = contact.data().address
      let tel = contact.data().telno.replace("+66","0")
      let json = {
        name : `${firstname} ${lastname}`,
        address: `${address} แขวง${district} เขต${amphoe} จังหวัด${province} ${zipcode}`,
        tel: tel
      }
      return json
    } catch (e) {
      console.log(e)
      return e
    }
  }
  ///////////////////////////////////////////////////////////////////////
  async editTrackID (soId,trackId) {
    try {
      await db.collection('so').doc(soId).set({
        trackingId: trackId
      },{ merge: true })
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}

module.exports = Order