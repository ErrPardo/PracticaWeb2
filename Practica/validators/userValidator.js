const {check}=require("express-validator")

const validateResults=require("../utils/handleValidator")
const { addressvalidation } = require("googleapis/build/src/apis/addressvalidation")

const validatorRegister=[
    check("email").exists().notEmpty().isEmail(),
    check("role").optional(),
    check("estado").optional(),
    check("password").exists().notEmpty().isLength( {min:8, max: 16} ),
    (req,res,next)=>{
        return validateResults(req,res,next)
    }
]

const validatorVerification=[
    check("code").exists().notEmpty().isLength(6),
    (req,res,next)=>{
        return validateResults(req,res,next)
    }
]

const validatorLogin=[
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength( {min:8, max: 16} ),
    (req,res,next)=>{
        return validateResults(req,res,next)
    }
]

const validatorRegisterPut=[
    check("email").exists().notEmpty().isEmail(),
    check("name").exists().notEmpty(),
    check("surnames").exists().notEmpty(),
    check("nif").exists().notEmpty().isLength(9),
    check("autonomo").exists().notEmpty(),
    (req,res,next)=>{
        return validateResults(req,res,next)
    }
]

const validatorLogo=[
    check("logoId").exists().notEmpty(),
    (req,res,next)=>{
        return validateResults(req,res,next)
    }
]

const validatorCompany=[
    check("company.name").exists().notEmpty(),
    check("company.cif").exists().notEmpty().isLength(9),
    check("company.street").exists().notEmpty(),
    check("company.number").exists().notEmpty().isNumeric(),
    check("company.postal").exists().notEmpty().isNumeric().isLength(5),
    check("company.city").exists().notEmpty(),
    check("company.province").exists().notEmpty(),
    (req,res,next)=>{
        return validateResults(req,res,next)
    }
]

const addressValidator=[
    check("address.street").exists().notEmpty(),
    check("address.number").exists().notEmpty(),
    check("address.postal").exists().notEmpty().isLength(5),
    check("address.city").exists().notEmpty(),
    check("address.province").exists().notEmpty(),
    (req,res,next)=>{
        return validateResults(req,res,next)
    }
]

module.exports={validatorRegister,validatorVerification,validatorLogin,validatorRegisterPut,validatorCompany,validatorLogo,addressValidator}