require("dotenv").config()
const functions = require('firebase-functions')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const apiRoutes = require('./routes/api')
const webhookRoutes = require('./routes/webhook')
const admin = require('firebase-admin')

app.use(bodyParser.json())
app.use(cors({ origin: true }));
app.use('/', apiRoutes)
app.use('/webhook', webhookRoutes)

exports.api = functions.region('asia-east2').https.onRequest(app);