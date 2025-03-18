const express=require('express')

const {crearUsuario,modificarUsuarioRegister,loginUsuario,modificarUsuario}=require('../controllers/users.js')
const {validatorRegister,validatorVerification, validatorLogin,validatorRegisterPut}=require("../validators/userValidator.js")
const verificationMiddleware = require('../middleware/verificationMiddleware.js')

routerUsers=express.Router()
routerUsers.use(express.json())

routerUsers.get('/',(req,res)=>{
    res.status(200).send("Todo Correcto")
})

routerUsers.post('/register',validatorRegister,crearUsuario)

routerUsers.put('/validation',validatorVerification,verificationMiddleware,modificarUsuarioRegister)

routerUsers.post('/login',validatorLogin,loginUsuario)

routerUsers.put('/register',validatorRegisterPut,modificarUsuario)

module.exports=routerUsers