const express = require('express')
const router = express.Router()
const dialogflow = require('../controllers/dialogflowControllers')
const lineapi = require('../controllers/webhookController')

router.post('/dialogflow', dialogflow.webhook)
router.post('/', lineapi.webhook)

module.exports = router