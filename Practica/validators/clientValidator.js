const {check}=require("express-validator")

const validateResults=require("../utils/handleValidator")

const validateClient=[
    check("address.street").exists().notEmpty(),
    check("address.number").exists().notEmpty(),
    check("address.postal").exists().notEmpty().isLength(5),
    check("address.city").exists().notEmpty(),
    check("address.province").exists().notEmpty(),
    check("cif").exists().notEmpty().isLength(9),
    check("name").exists().notEmpty(),
    (req,res,next)=>{
        return validateResults(req,res,next)
    }
]

module.exports={validateClient}