const express=require('express')

const  validatorMail  = require("../validators/mailValidator")
const  send  = require("../controllers/mail")

const routerMail=express.Router()
routerMail.use(express.json())

routerMail.post("/",validatorMail,send)

module.exports=routerMail
