const express = require('express')

const app = express()

app.use(express.json())

app.use('/',(req,res,next)=>{
    return res.status(200).json({"msg ":"Helow Customer"})
})

app.listen(3003,()=>{
    console.log("Server running on Customer port  ");
})