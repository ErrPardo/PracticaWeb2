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

module.exports={validatorRegister}