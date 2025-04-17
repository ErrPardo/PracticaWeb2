const express=require('express')

const {validateClient}=require('../validators/clientValidator')
const { crearClient,getClients,getOneClientById } = require('../controllers/clients')
const authMiddleware = require('../middleware/authMiddleware.js')

routerClient=express.Router()
routerClient.use(express.json())

routerClient.get('/',authMiddleware,getClients)

routerClient.get('/:id',authMiddleware,getOneClientById)

routerClient.get('/archive')

routerClient.delete('/')

routerClient.delete('/')

routerClient.post('/',validateClient,authMiddleware,crearClient)

routerClient.patch('/')




module.exports=routerClient