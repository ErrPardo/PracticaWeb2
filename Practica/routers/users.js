const express=require('express')

const {crearUsuario,modificarUsuarioRegister,loginUsuario,modificarUsuario, getUser, uploadImage,deleteUser,recoverPassword}=require('../controllers/users.js')
const {validatorRegister,validatorVerification, validatorLogin,validatorRegisterPut, validatorCompany, validatorLogo, addressValidator}=require("../validators/userValidator.js")
const verificationMiddleware = require('../middleware/verificationMiddleware.js')
const { uploadMiddleware } = require('../utils/handlestorage.js')
const authMiddleware = require('../middleware/authMiddleware.js')


routerUsers=express.Router()
routerUsers.use(express.json())

routerUsers.get('/',getUser)

routerUsers.post('/register',validatorRegister,crearUsuario)

routerUsers.put('/validation',validatorVerification,verificationMiddleware,modificarUsuarioRegister)

routerUsers.post('/login',validatorLogin,loginUsuario)

routerUsers.put('/register',validatorRegisterPut,modificarUsuario)

routerUsers.patch('/company',validatorCompany,modificarUsuario)

routerUsers.delete('/')

routerUsers.patch('/logo',uploadMiddleware.single("image"),(err,req,res,next)=>{
    if(err.code=="LIMIT_FILE_SIZE"){
        res.status(400).send("El archivo es demasiado grande")
    }
},uploadImage,validatorLogo,modificarUsuario)

routerUsers.delete('/',authMiddleware,deleteUser)

routerUsers.post('/validation',recoverPassword)

routerUsers.patch('/address',addressValidator,modificarUsuario)

module.exports=routerUsers