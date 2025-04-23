const express=require('express')
const handlePdf=require('../utils/handlePdf')


routerPdf=express.Router()
routerPdf.use(express.json())

routerPdf.get('/',handlePdf)

module.exports=routerPdf