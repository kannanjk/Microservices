const mongoose = require("mongoose")
const OrderModel = require('../Model/OrderModel.js')
const CouponModel = require('../Model/CouponModel.js')



const getAllUserOrders = async (req, res) => {
    const allorders = await OrderModel.find().lean().exec()
    res.render('admin/all-orders', { allorders, admin: true })
}

const addCoupon = async (req, res) => {
    try {
        const { code, isPercent, amount, usageLimit, minCartAmount, maxDiscountAmount } = req.body;
        const createdAt = new Date();
        let expireAfter = createdAt.getTime() + req.body.expireAfter * 24 * 60 * 60 * 1000;
        expireAfter = new Date(expireAfter);
        const coupon = { code, isPercent, amount, usageLimit, expireAfter, createdAt, minCartAmount, maxDiscountAmount };
        await CouponModel.create(coupon);
    } catch (error) {
        res.status(400).json({
            status: 'error while adding coupon',
            message: error,
        });
    }
}

const deletCoupon = async (req, res) => {
    try {
        await CouponModel.findByIdAndDelete(req.body.couponId)
        res.json({
            delete: 'success',
        });
    } catch (error) {
        res.json({
            delete: 'failed',
        });
    }
}

const getCoupons = async (req, res) => {
    const coupon = await CouponModel.find()
    req.session.pageIn = 'coupon'
}

const getOneCoupon = async (req, res) => {
    const couponId = req.params.id
    req.session.pageIn = 'coupon'
    const coupon = await CouponModel.find({ _id: mongoose.Types.ObjectId(couponId) })
}

const editCoupon = async (req, res) => {
    try {
        const { code, isPercent, amount, usageLimit, minCartAmount, maxDiscountAmount } = req.body;
        const coupon = { code, isPercent, amount, usageLimit, minCartAmount, maxDiscountAmount };
        await CouponModel.findByIdAndUpdate(req.params.id, coupon);
    } catch (error) {
        res.status(400).json({
            status: 'error while editing coupon',
            message: err,
        });
    }
}

module.exports = { getAllUserOrders,
    addCoupon, deletCoupon, getCoupons, getOneCoupon, editCoupon
}