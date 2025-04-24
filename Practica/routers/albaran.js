const express=require('express')
const authMiddleware = require('../middleware/authMiddleware')
const validateAlbaran = require('../validators/albaranValidator')
const { crearAlbaran, getAllAlbaranes, getOneAlbaranById } = require('../controllers/albaran')

const routerAlbaran=express.Router()
routerAlbaran.use(express.json())

routerAlbaran.post('/',validateAlbaran,authMiddleware,crearAlbaran)

routerAlbaran.get('/',authMiddleware,getAllAlbaranes)

routerAlbaran.get('/:id',authMiddleware,getOneAlbaranById)

routerAlbaran.get('/pdf/:id',authMiddleware)


module.exports=routerAlbaran

