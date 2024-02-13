const userModel = require('../Model/UserModel.js')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')


const verifylogin = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/login')
  }
}

const HomePage = async (req, res) => {
  // const products = await productModel.find().lean().exec()
  const user = req.session.user
  if (req.session.user) {
    if (req.session.user.isAdmin) {
      res.render('admin/add-products', { user, admin: true })
    } else {
      res.render('user/view-products', { products, user, use: true })
    }
  } else {
    res.render('user/view-products', { products, use: true })
  }

}

const LoginPage = (req, res, next) => {
  if (req.session.user) {
    res.redirect('/')
  } else {
    res.render('user/login')
  }
}

const SignUpPage = (req, res) => {
  if (req.session.user) {
    res.redirect('/')
  } else {
    res.render('user/signup')
  }
} 

const SignUp = async (req, res) => {
  const ath = new userModel(req.body)
  const { email, password } = req.body
  const pass = await bcrypt.hash(password, 10)
  ath.password = pass
  try {
    const newUser = await userModel.findOne({ email })
    if (newUser) {
      res.render('user/signup', { message: "User alredy exixt" })
    } else {
      const user = await ath.save()
      req.session.user = user
      res.redirect('/login')
    }
  } catch (error) {
    console.log(error);
  }
}

const Login = async (req, res) => {
  const { email, password } = req.body
  const user = await userModel.findOne({ email })
  if (user.access) {
    const pass = bcrypt.compare(password, user.password)
    if (pass) {
      req.session.user = user
      res.redirect('/')
    } else {
      res.render('user/login', { message: 'Password incorrect' })
    }
  } else {
    res.render('user/login', { message: 'user not fount' })
  }
}

const LogOut = (req, res) => {
  req.session.user = null
  res.redirect('/')
}

const blockUser = async (req, res) => {
  const userId = req.params.id
  await userModel.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: { access: false } },
  )
  res.redirect('/admi/account')
}

const getAllUser = async (req, res) => {
  const accounts = await userModel.find().lean().exec()
  res.render('admin/allusers', { accounts, admin: true })
}

const unBlockedUser = async (req, res) => {
  const userId = req.params.id
  await userModel.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: { access: true } },
  )
  res.redirect('/admi/account')
}


module.exports = {
  SignUp, LogOut, Login, LoginPage, verifylogin,getAllUser,
  HomePage, SignUpPage,blockUser,unBlockedUser,
}  