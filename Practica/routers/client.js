const express=require('express')

routerClient=express.Router()
routerClient.use(express.json())

routerClient.get('/',)
routerClient.get('/:id',)
routerClient.post('/',)


module.exports=routerClient