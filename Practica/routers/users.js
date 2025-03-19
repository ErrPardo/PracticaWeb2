const express=require('express')

const {crearUsuario,modificarUsuarioRegister,loginUsuario,modificarUsuario, getUser}=require('../controllers/users.js')
const {validatorRegister,validatorVerification, validatorLogin,validatorRegisterPut, validatorCompany}=require("../validators/userValidator.js")
const verificationMiddleware = require('../middleware/verificationMiddleware.js')

routerUsers=express.Router()
routerUsers.use(express.json())

routerUsers.get('/',getUser)

routerUsers.post('/register',validatorRegister,crearUsuario)

routerUsers.put('/validation',validatorVerification,verificationMiddleware,modificarUsuarioRegister)

routerUsers.post('/login',validatorLogin,loginUsuario)

routerUsers.put('/register',validatorRegisterPut,modificarUsuario)

routerUsers.patch('/company',validatorCompany,modificarUsuario)

module.exports=routerUsers