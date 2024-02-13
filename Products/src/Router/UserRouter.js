const express = require('express')
const {  addToCart, getCartProduct, changeproductquantity, removepro } = require('../Controler/UserControler.js')

const router = express.Router()

router.get('/add-to-cart/:id', addToCart)
router.get('/cart', getCartProduct)
router.post('/changeproductquantity', changeproductquantity)
router.get('/removepro/:id', removepro)


module.exports = router 