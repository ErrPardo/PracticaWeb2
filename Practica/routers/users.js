const express=require('express')

const {crearUsuario,modificarUsuarioRegister,loginUsuario,modificarUsuario, getUser, uploadImage,deleteUser,recoverPassword, comprobarUsuarioVerificado,cambiarPassword, AllUsers}=require('../controllers/users.js')
const {validatorRegister,validatorVerification, validatorLogin,validatorRegisterPut, validatorCompany, validatorLogo, addressValidator,inviteValidator}=require("../validators/userValidator.js")
const verificationMiddleware = require('../middleware/verificationMiddleware.js')
const { uploadMiddlewareMemory } = require('../utils/handlestorage.js')
const authMiddleware = require('../middleware/authMiddleware.js')


routerUsers=express.Router()
routerUsers.use(express.json())

routerUsers.get('/allUsers',AllUsers)

routerUsers.get('/',authMiddleware,getUser)

/**
* @openapi
* /api/users/register:
*  post:
*      tags:
*      - User
*      summary: "User register"
*      description: Register a new user
*      requestBody:
*          content:
*              application/json:
*                  schema:
*                       $ref: "#/components/schemas/user"
*      responses:
*          '200':
*              description: Returns the inserted object
*          '401':
*              description: Validation error
*      security:
*          - bearerAuth: []
*/
routerUsers.post('/register',validatorRegister,crearUsuario)

routerUsers.put('/validation',validatorVerification,verificationMiddleware,modificarUsuarioRegister)

routerUsers.post('/login',validatorLogin,loginUsuario)

routerUsers.put('/register',validatorRegisterPut,authMiddleware,modificarUsuario)

routerUsers.patch('/company',validatorCompany,authMiddleware,modificarUsuario)

routerUsers.delete('/')

routerUsers.patch('/logo',uploadMiddlewareMemory.single("image"),(err,req,res,next)=>{
    if(err.code=="LIMIT_FILE_SIZE"){
        res.status(400).send("El archivo es demasiado grande")
    }
},uploadImage,validatorLogo,authMiddleware,modificarUsuario)

routerUsers.delete('/',authMiddleware,deleteUser)

routerUsers.post('/validation',recoverPassword)

routerUsers.get('/verify',comprobarUsuarioVerificado)

routerUsers.patch('/cambiarPassword',validatorLogin,cambiarPassword)

routerUsers.patch('/address',addressValidator,authMiddleware,modificarUsuario)

routerUsers.post('/invite',inviteValidator,crearUsuario)

module.exports=routerUsers