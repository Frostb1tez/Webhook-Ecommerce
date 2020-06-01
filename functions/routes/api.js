const express = require('express')
const admin = require('firebase-admin')
const serviceAccount = require('./../service-account.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL
});
const router = express.Router()
const userControllers = require('../controllers/userControllers');
const productControllers = require('../controllers/productControllers')
const cartControllers = require('../controllers/cartControllers')

router.post('/adduser',userControllers.adduser)

router.post('/checkuser',userControllers.checkuser)

router.post('/getinfo',userControllers.getinfo)

router.post('/addinfo',userControllers.addinfo)

router.get('/getproduct', productControllers.getproducts)

router.get('/getproduct/:id', productControllers.getproductbyid)

router.post('/createproduct', productControllers.createproduct)

router.post('/editproduct', productControllers.editproduct)

router.post('/deleteproduct', productControllers.deleteproduct)

router.post('/uploadimage', productControllers.uploadimage)

router.post('/getcart', cartControllers.getcart)

router.post('/clearcart', cartControllers.clearcart)

router.post('/confirmcart',cartControllers.confirmcart)

router.post('/confirmorder',cartControllers.confirmorder)

router.get('/confirmpayment', cartControllers.confirmpayment)

module.exports = router