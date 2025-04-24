const express=require('express')
const authMiddleware = require('../middleware/authMiddleware')
const validateAlbaran = require('../validators/albaranValidator')
const { crearAlbaran } = require('../controllers/albaran')

const routerAlbaran=express.Router()
routerAlbaran.use(express.json())

routerAlbaran.post('/',validateAlbaran,authMiddleware,crearAlbaran)

routerAlbaran.get('/:id',authMiddleware)

routerAlbaran.get('/pdf/:id',authMiddleware)


module.exports=routerAlbaran

