const express=require('express')

const {validateClient}=require('../validators/clientValidator')
const { crearClient } = require('../controllers/clients')
const authMiddleware = require('../middleware/authMiddleware.js')

routerClient=express.Router()
routerClient.use(express.json())

routerClient.get('/',)

routerClient.get('/:id',)

routerClient.get('/archive')

routerClient.delete('/')

routerClient.delete('/')

routerClient.post('/',validateClient,authMiddleware,crearClient)

routerClient.patch('/')




module.exports=routerClient