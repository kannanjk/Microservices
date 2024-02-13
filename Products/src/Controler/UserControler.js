const productModel = require('../Model/ProductModel.js')
const cartModel = require('../Model/CartModel.js')
const mongoose = require('mongoose')


const addToCart = async (req, res) => {
  const proId = req.params.id
  const userId = req.session.user._id
  const userCart = await cartModel.findOne({ user: userId })
  if (userCart) {
    const proExist = userCart.products.findIndex((produc) => {
      return produc.item == proId
    })
    if (proExist != -1) {
      await cartModel.findOneAndUpdate(
        { user: userId, 'products.item': proId },
        { $inc: { 'products.$.quantity': 1 } },
        { upsert: true }
      )
    } else {
      const proObj = {
        item: proId,
        quantity: 1
      }
      await cartModel.updateOne(
        { user: userId },
        { $push: { products: proObj } }
      )
    }
  } else {
    const proObj = {
      item: proId,
      quantity: 1
    }
    const cart = cartModel({
      user: userId,
      products: [proObj]
    })
    await cart.save()
  }
}

const getCartpro = async (userId) => {
  return await cartModel.aggregate([
    {
      $match: { 'user': new mongoose.Types.ObjectId(userId) }
    },
    {
      $unwind: '$products'
    },
    {
      $project: {
        item: '$products.item',
        quantity: '$products.quantity'
      }
    },
    {
      $lookup: {
        from: productModel.collection.name,
        localField: 'item',
        foreignField: '_id',
        as: 'product'
      }
    },
    {
      $project: {
        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
      }
    }
  ])
}

const cartTot = async (userId) => {
  const tot = await cartModel.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(userId) }
    },
    {
      $unwind: '$products'
    },
    {
      $project: {
        item: '$products.item',
        quantity: '$products.quantity'
      }
    },
    {
      $lookup: {
        from: productModel.collection.name,
        localField: 'item',
        foreignField: '_id',
        as: 'product'
      }
    },
    {
      $project: {
        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: { $multiply: ['$quantity', '$product.prize'] } }
      }
    }
  ])
  const total = tot[0].total
  return total
}

const getCartProduct = async (req, res) => {
  const userId = req.session.user._id
  try {
    const products = await getCartpro(userId)
    if (products.length > 0) {
      const totalValue = await cartTot(userId)
      res.render('user/cart', { products, totalValue, user: req.session.user._id, use: true })
    } else {
      res.render('user/cart', { products, user: req.session.user._id, use: true })
    }
  } catch (error) {
    console.log(error);
  }
}

const changeproductquantity = async (req, res) => {
  const cart = req.body.cart
  const count = parseInt(req.body.count)
  const quantity = parseInt(req.body.quantity)
  if (count == -1 && quantity == 1) {
    const a = await cartModel.updateOne(
      { _id: cart },
      { $pull: { products: { item: req.body.product } } }
    )
  } else {
    const b = await cartModel.updateOne(
      { _id: cart, 'products.item': req.body.product },
      { $inc: { 'products.$.quantity': count } }
    )
  }
}

const removepro = async (req, res) => {
  const userId = req.session.user._id
  const cartId = req.params.id
  await cartModel.updateOne(
    { user: userId },
    { $pull: { products: { item: cartId } } }
  )
  res.json({ status: true })
}

const getCartCount = async (userId) => {
  let count = 0
  const cart = await cartModel.findOne({ user: userId })
  if (cart) {
    return count = cart.products.length
  }
}





module.exports = { removepro,
  getCartProduct, changeproductquantity, addToCart,
}  