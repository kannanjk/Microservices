const Razorpay = require('razorpay')
const OrderModel = require('../Model/OrderModel.js')
const CouponModel = require('../Model/CouponModel.js')

var instance = new Razorpay({
  key_id: 'rzp_test_2KevjUREiq5hiq',
  key_secret: 'ZpQUxhvR0TE9Z8LzIMZj8AeK',
})

const checkCoupon = async (req, res) => {
  try {
    const { user } = req.session;
    const coupon = await CouponModel.findOne({ code: req.body.code });
    const cartTotal = await cartTot(user._id)
    const checkUser = await CouponModel.findOne({ code: req.body.code, 'userUsed.userId': user._id });
    if (coupon && coupon.expireAfter.getTime() > Date.now()) {
      if (cartTotal < coupon.minCartAmount) {
        res.json({
          checkstatus: 'error',
          message: 'Cart amount is not sufficient',
        });
      } else {
        if (checkUser || req.session.couponApplied === req.body.code) {
          res.json({
            checkstatus: 'error',
            message: 'This coupon already applied',
          });
        } else {
          req.session.couponApplied = coupon._id;
          res.json({
            maxDiscountAmt: coupon.maxDiscountAmount,
            message: 'Coupon Successfully added',
          });
        }
      }
    } else {
      res.json({
        checkstatus: 'error',
        message: 'Cannot apply coupon',
      });
    }

  } catch (error) {
    res.status(400).json({
      checkstatus: 'error',
      message: 'Error while checking coupon code',
    });
  }
}

const genaratRaz = (orderId, total) => {
  var options = {
    amount: total * 100,
    currency: "INR",
    receipt: "" + orderId
  };
  instance.orders.create(options, function (err, order) {
    if (err) {
      console.log(err);
      console.log("ivide err");
    } else {
      return order
      console.log("successes");
    }
  })
}

const placeOrder = async (req, res) => {
  console.log("kannan");
  console.log(req.body);
  const products = await cartModel.findOne({ user: req.body.userId })
  if (products.length > 0) {
    const total = await cartTot(req.body.userId)
    const { mobile, address, pincode, name, userId } = req.body
    let status = req.body['payment-method'] === 'COD' ? 'placed' : 'pending'
    const order = new OrderModel({
      deliveryDetils: {
        mobile: mobile,
        address: address,
        totalAmount: total,
        pincode: pincode,
        name: name
      },
      userId: userId,
      paymentmethod: req.body['payment-method'],
      products: products,
      status: status,
      date: new Date()
    })
    const resp = await order.save()
    await cartModel.deleteOne({ user: req.body.userId })
    if (req.body['payment-method'] === 'COD') {
      res.json({ codSuccess: true })
    } else {
      const response = genaratRaz(resp._id, total)
      res.json(response)
    }
  }
}

const verifyPayment = async (req, res) => {
  const crypto = require('crypto')
  let hmac = crypto.createHmac('sha256', 'ZpQUxhvR0TE9Z8LzIMZj8AeK')
  hmac.update(req.body['payment[razorpay_order_id]'] + '|' + req.body['payment[razorpay_payment_id]'])
  hmac = hmac.digest('hex')
  if (hmac == req.body['payment[razorpay_signature]']) {
    resolve()
  } else {
    reject()
  }
  await OrderModel.updateOne(
    { _id: req.body['order[receipt]'] },
    {
      $set: {
        status: 'placed'
      }
    }
  )
}

const successOrder = (req, res) => {
  res.render('user/order-success', { user: req.session.user, use: true })
}

module.exports = {
  checkCoupon, placeOrder, successOrder, verifyPayment
}  