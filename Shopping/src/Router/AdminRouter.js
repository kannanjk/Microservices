const express = require('express')
const {  getAllUserOrders, addCoupon, deletCoupon, getCoupons, getOneCoupon, editCoupon } = require('../Controler/AdminControler')

const app = express.Router()

app.get('/allorders',getAllUserOrders)
app.post('/addCoupon',addCoupon)
app.get('/getCoupon',getCoupons)
app.route('/getOneCoupon/:id').get(getOneCoupon).post(editCoupon)
app.post('/delete-coupon',deletCoupon)

module.exports = app