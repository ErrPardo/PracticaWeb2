const express=require('express')
const authMiddleware = require('../middleware/authMiddleware')
const validateAlbaran = require('../validators/albaranValidator')
const { crearAlbaran, getAllAlbaranes, getOneAlbaranById, deleteAlbaran, uploadFile } = require('../controllers/albaran')
const { uploadMiddlewareMemory } = require('../utils/handlestorage.js')
const handlePdf=require('../utils/handlePdf')
const authAlbaran=require('../middleware/authAlbaran')

const routerAlbaran=express.Router()
routerAlbaran.use(express.json())

routerAlbaran.post('/',validateAlbaran,authMiddleware,crearAlbaran)

routerAlbaran.get('/',authMiddleware,getAllAlbaranes)

routerAlbaran.get('/:id',authMiddleware,getOneAlbaranById)

routerAlbaran.get('/pdf/:id',authMiddleware,authAlbaran,handlePdf,uploadMiddlewareMemory.single('image'),uploadFile)

routerAlbaran.delete('/:id',authMiddleware,deleteAlbaran)


module.exports=routerAlbaran

