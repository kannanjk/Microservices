const express = require('express')

const app = express()

app.use(express.json())

app.use('/',(req,res,next)=>{
    return res.status(200).json({"msg ":"Helow Products"})
})

app.listen(3001,()=>{
    console.log("Server running on Products port  ");
})