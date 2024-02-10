const express = require('express')
const cors = require('cors')
const proxy = require('express-http-proxy')

const app = express()

app.use(express.json())
app.use(cors())

app.use('/customer',proxy('http://localhost:3003'))
app.use('/shopping',proxy('http://localhost:3002'))
app.use('/',proxy('http://localhost:3001')) //Product

app.listen(3000,()=>{
    console.log("Server running on getway port  ");
})