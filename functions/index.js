require("dotenv").config()
const functions = require('firebase-functions')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const apiRoutes = require('./routes/api')
const webhookRoutes = require('./routes/webhook')
// const LinePay = require("./services/linePayService")
const admin = require('firebase-admin')
const generateRandomKey = (length = 16) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";

  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }

  return retVal;
};
const bucket = admin.storage().bucket('siamproject-dbffa.appspot.com')

app.use(bodyParser.json())
app.use(cors({ origin: true }));
app.use('/', apiRoutes)
app.use('/webhook', webhookRoutes)

// app.post('/reserve',(req,res) => {
//   const paymentKey = generateRandomKey(32);
//   let linePay = new LinePay({
//     channelId: process.env.LINE_PAY_CHANNEL_ID,
//     channelSecret: process.env.LINE_PAY_CHANNEL_SECRET,
//     uri: 'https://sandbox-api-pay.line.me'
//   })
//   let orderId = 'Order2019101500001'
//   let amount = 4000
//   let id = 'Item20191015001'
//   const order = {
//     amount: amount,
//     currency: 'THB',
//     orderId: orderId,
//     packages: [
//       {
//         id: id,
//         amount: 4000,
//         name: 'testPackageName',
//         products: [
//           {
//             name: 'testProductName',
//             quantity: 2,
//             price: 2000
//           }
//         ]
//       }
//     ],
//     redirectUrls: {
//       confirmUrl: `https://0ff27e2b.ngrok.io/siamproject-dbffa/us-central1/api/confirmpayment?confirm=true&orderId=${orderId}&amount=${amount}&name=${id}&keys=${paymentKey}`,
//     }
//   }

//   linePay.request(order)
//     .then(d => {
//       if (d.returnCode === '0000') {
//         console.log(d.info)
//         return res.status(200).send({
//           status: 200,
//           message: 'Success',
//           data : d.info
//         })
//       }
//     })
//     .catch(e => {
//       console.log(e)
//       return res.send(e)
//     })
// })

// app.get('/confirmpayment',(req,res) => {
//   console.log(req.query)
// })

exports.api = functions.https.onRequest(app);