const express=require('express')

const {crearUsuario}=require('../controllers/users.js')
const {validatorRegister}=require("../validators/userValidator.js")

routerUsers=express.Router()
routerUsers.use(express.json())

routerUsers.get('/',(req,res)=>{
    res.status(200).send("Todo Correcto")
})

routerUsers.post('/',validatorRegister,crearUsuario)

module.exports=routerUsers