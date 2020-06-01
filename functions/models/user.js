const admin = require('firebase-admin')
const db = admin.firestore();
var FieldValue = admin.firestore.FieldValue;

class User {
  constructor (data) {
    this.id = data.tokenId
    this.userid = data.userid
    this.tel = data.tel
    this.name = data.name
    this.address = data.address
  }

  async getdata () {
    try{
      var d = await db.collection('users').doc(this.id).get()
      return d.data()
    } catch (e) {
      console.log(e)
      return e
    }
  }

  async adduser () {
    try{
      var d = db.collection('users').doc(this.id).set({
        tokenid: this.id,
        userid: this.userid,
        telno: this.tel,
        time_created: FieldValue.serverTimestamp()
      }, { merge: true })
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
  
  async addinfo () {
    try {
      db.collection('users').doc(this.id).set({
        name: this.name,
        address: this.address,
        time_updated: FieldValue.serverTimestamp()
      }, {merge: true})
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async checkuser () {
    try{
      var d = await db.collection('users').doc(this.id).get()
      if (d.data()) {
        return true
      } else {
        return false
      }
    } catch (e) {
      console.log(e)
      return e
    }
  }
}

module.exports = User