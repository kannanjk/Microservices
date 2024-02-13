const express = require('express')
const { HomePage, LogOut, Login, LoginPage, SignUp, SignUpPage,blockUser, unBlockedUser, getAllUser } = require('../Controler/UserControler.js')

const router = express.Router()

router.get('/', HomePage)
router.get('/login', LoginPage)
router.get('/signup', SignUpPage)
router.post('/signup', SignUp) 
router.post('/login', Login)
router.get('/logOut', LogOut)
router.get('/blockUser/:id',blockUser)
router.get('/unblockUser/:id',unBlockedUser)
router.get('/account',getAllUser)


module.exports = router