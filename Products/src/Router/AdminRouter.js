const express = require('express')
const { AddProduct, GetAllProducts, deleteProduct, getSingleProduct, UpdateProduct} = require('../Controler/AdminControler')

const app = express.Router()

app.post('/add-products',AddProduct)
app.get('/getAllProducts',GetAllProducts)
app.get('/delete-product/:id',deleteProduct)
app.get('/edit-products/:id',getSingleProduct)
app.post('/edit-products/:id',UpdateProduct)
module.exports = app