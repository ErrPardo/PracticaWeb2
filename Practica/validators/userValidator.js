const {check}=require("express-validator")

const validateResults=require("../utils/handleValidator")

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
    (req,res,next)=>{
        return validateResults(req,res,next)
    }
]

module.exports={validatorRegister,validatorVerification,validatorLogin,validatorRegisterPut}