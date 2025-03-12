const express=require('express')

routerUsers=express.Router()
routerUsers.use(express.json())

routerUsers.get('/',(req,res)=>{
    res.status(200).send("Todo Correcto")
})


module.exports=routerUsers