const crypto = require('crypto-js')
const axios = require('axios')
const uuidv4 = require('uuid/v4')

class linePay {

  constructor (data) {
    this.channelId = data.channelId
    this.channelSecret = data.channelSecret
    this.URI = data.uri
  }
  request (body) {
    return new Promise((reslove, reject) => {
      let api = '/v3/payments/request'
      let configs = {
        headers: this.__header('POST', api, body)
      }
      axios.post(this.URI + api, body, configs).then(response => {
        reslove(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }
  confirm (body, transactionId) {
    return new Promise((reslove, reject) => {
      let api = `/v3/payments/${transactionId}/confirm`
      let configs = {
        headers: this.__header('POST', api, body)
      }
      axios.post(this.URI + api, body, configs).then(response => {
        reslove(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  capture (body, transactionId) {
    return new Promise((reslove, reject) => {
      let api = `/v3/payments/authorizations/${transactionId}/capture`
      let configs = {
        headers: this.__header('POST', api, body)
      }
      axios.post(this.URI + api, body, configs).then(response => {
        reslove(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  void (transactionId) {
    return new Promise((reslove, reject) => {
      let api = `/v3/payments/authorizations/${transactionId}/void`
      let configs = {
        headers: this.__header('POST', api, {})
      }
      axios.post(this.URI + api, {}, configs).then(response => {
        reslove(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  refund (body, transactionId) {
    return new Promise((reslove, reject) => {
      let api = `/v3/payments/${transactionId}/refund`
      let configs = {
        headers: this.__header('POST', api, body)
      }
      axios.post(this.URI + api, body, configs).then(response => {
        reslove(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  paymentDetails (params) {
    return new Promise((reslove, reject) => {
      let api = `/v3/payments`
      let configs = {
        params: params,
        headers: this.__header('GET', api, this.__json2url(params))
      }
      axios.get(this.URI + api, configs).then(response => {
        reslove(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  checkPaymentStatus (transactionId) {
    return new Promise((reslove, reject) => {
      let api = `/v3/payments/requests/${transactionId}/check`
      let configs = {
        headers: this.__header('GET', api, '')
      }
      axios.get(this.URI + api, configs).then(response => {
        reslove(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  checkRegKey (params, regKey) {
    return new Promise((reslove, reject) => {
      let api = `/v3/payments/preapprovedPay/${regKey}/check`
      let configs = {
        params: params,
        headers: this.__header('GET', api, this.__json2url(params))
      }
      axios.get(this.URI + api, configs).then(response => {
        reslove(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  preapprovedPay (body, regKey) {
    return new Promise((reslove, reject) => {
      let api = `/v3/payments/preapprovedPay/${regKey}/payment`
      let configs = {
        headers: this.__header('POST', api, body)
      }
      axios.post(this.URI + api, body, configs).then(response => {
        reslove(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  expireRegKey (regKey) {
    return new Promise((reslove, reject) => {
      let api = `/v3/payments/preapprovedPay/${regKey}/expire`
      let configs = {
        headers: this.__header('POST', api, {})
      }
      axios.post(this.URI + api, {}, configs).then(response => {
        reslove(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }

  __json2url (json) {
    let url = Object.keys(json).map( idx => {
      return encodeURIComponent(idx) + '=' + encodeURIComponent(json[idx])
    }).join('&')
    return url
  }

  __header (method, uri, body) {
    let nonce = uuidv4()
    return {
      'Content-Type': 'application/json',
      'X-LINE-ChannelId': this.channelId,
      'X-LINE-Authorization-Nonce': nonce,
      'X-LINE-Authorization': this.__hash(method, uri, body, nonce)
    }
  }

  __hash (method, uri, body, nonce) {
    let encrypt = null
    if (method === 'GET') {
      encrypt = crypto.HmacSHA256(this.channelSecret + uri + body + nonce, this.channelSecret)
    }
    if (method === 'POST') {
      encrypt = crypto.HmacSHA256(this.channelSecret + uri + JSON.stringify(body) + nonce, this.channelSecret)
    }
    return crypto.enc.Base64.stringify(encrypt)
  }
}

module.exports = linePay