const express=require('express')

const {validateClient}=require('../validators/clientValidator')
const { crearClient,getClients,getOneClientById, deleteClient,restoreClient,modificarClient} = require('../controllers/clients')
const authMiddleware = require('../middleware/authMiddleware.js')

routerClient=express.Router()
routerClient.use(express.json())

routerClient.get('/',authMiddleware,getClients)

routerClient.get('/:id',authMiddleware,getOneClientById)

routerClient.get('/archive',authMiddleware,getOneClientById)

routerClient.delete('/archive/:id',authMiddleware,deleteClient)

routerClient.delete('/:id',authMiddleware,deleteClient)

routerClient.post('/',validateClient,authMiddleware,crearClient)

routerClient.put('/:id',validateClient,authMiddleware,modificarClient)

routerClient.patch('/restore/:id',authMiddleware,restoreClient)




module.exports=routerClient