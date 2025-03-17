const express=require('express')

const {crearUsuario,modificarUsuario,loginUsuario}=require('../controllers/users.js')
const {validatorRegister,validatorVerification, validatorLogin}=require("../validators/userValidator.js")
const verificationMiddleware = require('../middleware/verificationMiddleware.js')

routerUsers=express.Router()
routerUsers.use(express.json())

routerUsers.get('/',(req,res)=>{
    res.status(200).send("Todo Correcto")
})

routerUsers.post('/register',validatorRegister,crearUsuario)

routerUsers.put('/validation',validatorVerification,verificationMiddleware,modificarUsuario)

routerUsers.post('/login',validatorLogin,loginUsuario)

module.exports=routerUsers