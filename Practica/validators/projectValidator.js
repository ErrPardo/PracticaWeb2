const {check}=require("express-validator")

const validateResults=require("../utils/handleValidator")

const validatorProject=[
    check("address.street").exists().notEmpty(),
    check("address.number").exists().notEmpty().isInt(),
    check("address.postal").exists().notEmpty().isLength(5).isInt(),
    check("address.city").exists().notEmpty(),
    check("address.province").exists().notEmpty(),
    check("projectCode").exists().notEmpty(),
    check("code").exists().notEmpty(),
    check("clientId").exists().notEmpty().isLength(24),
    check("name").exists().notEmpty(),
    check("notes").optional(),
    check("begin").optional(),
    check("end").optional(),
    (req,res,next)=>{
        return validateResults(req,res,next)
    }
]


module.exports={validatorProject}