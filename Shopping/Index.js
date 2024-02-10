const express = require('express')

const app = express()

app.use(express.json())

app.use('/',(req,res,next)=>{
    return res.status(200).json({"msg ":"Helow Shopping"})
})

app.listen(3002,()=>{
    console.log("Server running on Shopping port  ");
})