const express = require('express')
const {placeOrder, successOrder, verifyPayment, checkCoupon } = require('../Controler/UserControler.js')

const router = express.Router()

router.post('/verifycoupon', checkCoupon)
router.post('/place-order', placeOrder) 
router.get('/order-success', successOrder)
router.post('/verify-Payment', verifyPayment)


module.exports = router