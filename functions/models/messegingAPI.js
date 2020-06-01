const axios = require('axios')
const admin = require('firebase-admin')
const db = admin.firestore();
const LinePay = require("./linePayService")

class messegingAPI {
  constructor(data) {
    this.data = data
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////
  async getproduct () {
    try {
      let products = []
      let productsArray = []
      let i = 0
      let content = []
      let querySnapshot = await db.collection('product').get()
      querySnapshot.forEach(doc => {
        productsArray.push(doc.data())
        productsArray[i].id = doc.id
        products.push(productsArray[i])
        i++
      })
      products.forEach((v) => {
        v.saleprice = v.product_price + 2000
        content.push({
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "image",
                "url": v.product_image,
                "size": "full",
                "aspectMode": "cover",
                "aspectRatio": "2:3",
                "gravity": "top"
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": v.product_name,
                        "size": "xl",
                        "color": "#ffffff",
                        "weight": "bold"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "text",
                        "text": v.product_price.toLocaleString() + " THB",
                        "color": "#ebebeb",
                        "size": "sm",
                      },
                      {
                        "type": "text",
                        "text": v.saleprice.toLocaleString() + " THB",
                        "color": "#ffffffcc",
                        "decoration": "line-through",
                        "gravity": "bottom",
                        "size": "sm"
                      }
                    ],
                    "spacing": "lg"
                  },
                  {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "button",
                        "action": {
                          "type": "uri",
                          "label": "View Detail",
                          "uri": `https://liff.line.me/1654085729-19prnAVz/?id=${v.product_id}`
                        },
                        "height": "sm",
                        "color": "#FFFFFF"
                      }
                    ],
                    "borderWidth": "1px",
                    "cornerRadius": "4px",
                    "spacing": "sm",
                    "borderColor": "#ffffff",
                    "margin": "xxl",
                    "height": "40px"
                  }
                ],
                "position": "absolute",
                "offsetBottom": "0px",
                "offsetStart": "0px",
                "offsetEnd": "0px",
                "backgroundColor": "#03303Acc",
                "paddingAll": "20px",
                "paddingTop": "18px"
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": v.product_stock != 0 ? "SALE" : "Sold Out",
                    "color": "#ffffff",
                    "align": "center",
                    "size": "xs",
                    "offsetTop": "3px"
                  }
                ],
                "position": "absolute",
                "cornerRadius": "20px",
                "offsetTop": "18px",
                "backgroundColor": v.product_stock != 0 ? "#3cff00" : "#ff334b",
                "offsetStart": "18px",
                "height": "25px",
                "width": "53px"
              }
            ],
            "paddingAll": "0px"
          }
        })
      })
      let payloadJson = {
        "type": "flex",
        "altText": "สินค้า",
        "contents": {
          "type": "carousel",
          "contents": content
        }  
      }
      return payloadJson
    } catch (e) {
      console.log(e)
      return e
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  async getorder (userId) {
    try {
      let d = await db.collection('users').doc(userId).collection('qo').get()
      let orderid = d.docs.map(doc => doc.id)
      // let data = d.docs.map(doc => JSON.parse(doc.data()))
      let content = []
      let data = d.docs.map(doc => ({id:doc.id,data:doc.data()}))
      let address = data[0].data.address.address
      let district = data[0].data.address.district
      let amphoe = data[0].data.address.amphoe
      let province = data[0].data.address.province
      let zipcode = data[0].data.address.zipcode
      let name = data[0].data.contact.split("+",1).toString()
      let tel = data[0].data.contact.replace("+66","0").slice(-10)
      let products = data[0].data.product
      products.forEach(v => {
        content.push({
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "text",
              "text": `${v.product_name} x${v.product_amount.toLocaleString()}`,
              "size": "sm",
              "color": "#555555",
              "wrap" : true
            },
            {
              "type": "text",
              "text": v.product_price.toLocaleString() + " THB",
              "size": "sm",
              "color": "#111111",
              "align": "end"
            }
          ]
        })
      })
      return {
        type: "flex",
        altText: "รายการสั่งซื้อของคุณ",
        contents: {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "Quatation Order",
                "weight": "bold",
                "color": "#1DB446",
                "size": "sm"
              },
              {
                "type": "text",
                "text": "Cheeta Store",
                "weight": "bold",
                "size": "xxl",
                "margin": "md"
              },
              {
                "type": "separator",
                "margin": "xxl",
                "color": "#000000"
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "xxl",
                "spacing": "sm",
                "contents": content
              },
              {
                "type": "separator",
                "color": "#000000",
                "margin": "xxl"
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "xxl",
                "contents": [
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "text",
                        "text": "TOTAL",
                        "size": "sm",
                        "color": "#555555"
                      },
                      {
                        "type": "text",
                        "text": data[0].data.totalPrice.toLocaleString() + " THB",
                        "size": "sm",
                        "color": "#111111",
                        "align": "end"
                      }
                    ],
                  }
                ]
              },
              {
                "type": "separator",
                "color": "#000000",
                "margin": "xxl"
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "xxl",
                "contents": [
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "margin": "xxl",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Contact name",
                        "color": "#555555",
                        "size": "sm"
                      },
                      {
                        "type": "text",
                        "text": name,
                        "wrap": true,
                        "color": "#111111",
                        "size": "sm",
                        "align": "end"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "margin": "xxl",
                    "contents": [
                      {
                        "type": "text",
                        "text": "ที่อยู่จัดส่ง",
                        "size": "sm",
                        "color": "#555555"
                      },
                      {
                        "type": "text",
                        "text": `${address} แขวง${district} เขต${amphoe} จังหวัด${province} ${zipcode}`,
                        "wrap": true,
                        "size": "sm",
                        "color": "#111111",
                        "align": "end"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "margin": "xxl",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Phone number",
                        "size": "sm",
                        "color": "#555555"
                      },
                      {
                        "type": "text",
                        "text": tel,
                        "size": "sm",
                        "color": "#111111",
                        "align": "end"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "button",
                        "action": {
                          "type": "postback",
                          "label": "ชำระด้วย Rabbit LINE Pay",
                          "data": `confirmpayment/?orderId=${orderid.toString()}`
                        },
                        "style": "primary"
                      },
                      {
                        "type": "button",
                        "action": {
                          "type": "postback",
                          "label": "ยกเลิก Order",
                          "data": `cancelorder/?orderId=${orderid.toString()}`
                        },
                        "style": "primary",
                        "color": "#8B0000",
                        "margin": "sm"
                      }
                    ],
                    "margin": "xxl"
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "contents": [
                      {
                        "type": "text",
                        "text": "ORDER ID",
                        "size": "xs",
                        "color": "#aaaaaa"
                      },
                      {
                        "type": "text",
                        "text": orderid.toString(),
                        "color": "#aaaaaa",
                        "size": "xs",
                        "margin": "xxl",
                        "align": "end"
                      }
                    ],
                    "margin": "xxl"
                  }
                ]
              }
            ]
          },
          "styles": {
            "footer": {
              "separator": true
            }
          }
        }
      
      }
    } catch (e) {
      let d = {
        status: 404,
        messege: 'ไม่มีใบเสนอราคา กรุุณายืนยันตะกร้าสินค้า'
      }
      return d
    }
    
  }
  ///////////////////////////////////////////////////////////////////////////////////////////
  async getHistory (userId) {
    var self = this
    try {
      let d = await db.collection('users').doc(userId).collection('so').get()
      let orderId = d.docs.map(doc => doc.id)
      let items = []
      orderId.forEach(v => {
        items.push({
          "type": "action",
          "action": {
           "type": "postback",
           "label": v.toString(),
           "data": `history/?saleorderId=${v.toString()}`
          }
        })
      })
      return {
        "type": "text",
        "text": "นี่คือรายการประวัติการสั่งซื้อของคุณทั้งหมด",
        "quickReply": {
         "items": items
        }
       }
    } catch (e) {
      console.log(e)
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////
  async getHistoryDetail (soId, userId) {
    var self = this
    console.log(soId)
  } 
  ///////////////////////////////////////////////////////////////////////////////////////////
  async reservePayment (orderId, userId) {
    var self = this
    const replyToken = self.data.body.events[0].replyToken
    try{
      let d = await db.collection('users').doc(userId).collection('qo').doc(orderId).get().catch(e => console.log(e))
      if (!d.data()) {
        self.sendMessage('ไม่มีใบเสนอราคานี้ หรือใบเสนอราคานี้ถูกชำระเงินหรือถูกลบไปแล้ว', replyToken)
      }
      let totalPrice = d.data().totalPrice
      let products = []
      const paymentKey = self.generateRandomKey(32)
      const linePay = new LinePay({
        channelId: process.env.LINE_PAY_CHANNEL_ID,
        channelSecret: process.env.LINE_PAY_CHANNEL_SECRET,
        uri: 'https://sandbox-api-pay.line.me'
      })
      d.data().product.forEach(v => {
        products.push({
          id: v.product_id,
          name: v.product_name,
          quantity: v.product_amount,
          price: v.product_price,
          imageUrl: v.product_image
        })
      })
      const order = {
        amount: totalPrice,
        currency: 'THB',
        orderId: orderId,
        packages: [
          {
            id: orderId,
            amount: totalPrice,
            name: 'Cheeta Store',
            products: products
          }
        ],
        redirectUrls: {
          confirmUrl: `https://92bc9f55.ngrok.io/siamproject-dbffa/us-central1/api/confirmpayment?userId=${userId}&orderId=${orderId}&amount=${totalPrice}&keys=${paymentKey}`,
        }
      }
      let res = await linePay.request(order)
      if (res.returnCode === '0000') {
        let payloadJson = {
          "type": "flex",
          "altText": "ยืนยันการชำระเงิน",
          "contents": {
            "type": "bubble",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "กรุณาคลิกที่ปุ่มเพื่อยืนยันการชำระเงิน",
                  "size": "md",
                  "style": "italic",
                  "decoration": "none",
                  "align": "center"
                },
                {
                  "type": "button",
                  "action": {
                    "type": "uri",
                    "label": "Payment",
                    "uri": res.info.paymentUrl.web
                  },
                  "style": "primary",
                  "height": "md",
                  "margin": "xxl",
                  "position": "relative"
                }
              ]
            }
          }
        }
        self.sendPayload(payloadJson,replyToken)
      } else {
        console.log(res)
        self.sendMessage('การชำระเงินเกิดข้อผิดพลาดหรือติดต่อเซิฟเวอร์ Line ไม่ได้',replyToken)
      }
    } catch (e) {
      console.log(e)
      self.sendMessage('ไม่สามารถติดต่อเซิฟเวอร์ได้',replyToken)
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////
  async sendMessage (data,replyToken) {
    try {
      axios({
        method: 'post',
        url: `${process.env.LINE_MESSAGING_API}/reply`,
        headers: {
          'Content-Type': process.env.LINE_HEADER_CONTENTTYPE,
          'Authorization': process.env.LINE_HEADER_AUTH
        },
        data: JSON.stringify({
          replyToken: replyToken,
          messages: [{
            "type": "text",
            "text": data
        }]
        })
      })
    } catch (e) {
      console.log(e)
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////
  async pushMessage (data,userid) {
    try {
      axios({
        method: 'post',
        url: `${process.env.LINE_MESSAGING_API}/push`,
        headers: {
          'Content-Type': process.env.LINE_HEADER_CONTENTTYPE,
          'Authorization': process.env.LINE_HEADER_AUTH
        },
        data: JSON.stringify({
          to: userid,
          messages: [{
            "type": "text",
            "text": data
        }]
        })
      })
    } catch (e) {
      console.log(e)
    }
  }
///////////////////////////////////////////////////////////////////////////////////////////////////////////
  async sendPayload (data,replyToken) {
    let self = this
    try {
      axios({
        method: 'post',
        url: `${process.env.LINE_MESSAGING_API}/reply`,
        headers: {
          'Content-Type': process.env.LINE_HEADER_CONTENTTYPE,
          'Authorization': process.env.LINE_HEADER_AUTH
        },
        data: JSON.stringify({
          replyToken: replyToken,
          messages: [data]
        })
      })
    } catch (e) {
      console.log(e)
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////
  async postToDialogflow () {
    this.data.headers.host = "bots.dialogflow.com"
    return axios({
      method: 'post',
      url: "https://bots.dialogflow.com/line/2bc534f4-2e2c-42de-9c2e-4f4699bc9bee/webhook",
      headers: this.data.headers,
      data: JSON.stringify(this.data.body)
    })
  }
//////////////////////////////////////////////////////////////////////////////////////////
  async cancelOrder (orderId,userId) {
    var self = this
    const replyToken = self.data.body.events[0].replyToken
    try {
      await db.collection('users').doc(userId).collection('qo').doc(orderId).delete()
      self.sendMessage('ลบใบเสนอราคาเรียบร้อยแล้ว',replyToken)
    } catch (e) {
      console.log(e)
      self.sendMessage('ไม่สามารถติดต่อเซิฟเวอร์ได้',replyToken)
    }
  }
///////////////////////////////////////////////////////////////////////////////////////////
  generateRandomKey (length = 16) {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  };

}

module.exports = messegingAPI