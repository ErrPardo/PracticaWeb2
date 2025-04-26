const {check,body}=require("express-validator")

const validateResults=require("../utils/handleValidator")

const validateAlbaran=[
    check("albaranCode").exists().notEmpty(),
    check("clientId").exists().notEmpty().isLength(24),
    check("projectId").exists().notEmpty().isLength(24),
    check("description").exists().notEmpty(),
    check("hours").exists().notEmpty().isInt(),
    check("format").exists().notEmpty().isIn(["hours", "materials"]),

    body().custom((value) => {
        const { format, multi, materials } = value;
    
        if (format === "hours") {
            if (materials && materials.length > 0) {
                throw new Error("No se pueden enviar materiales cuando el formato es 'hours'")
            }
        }
        if (format === "materials") {
            if (multi && multi.length > 0) {
                throw new Error("No se pueden enviar datos en 'multi' cuando el formato es 'materials'")
            }  
        }
    
        return true;
    }),

    check("multi.*.name").if(body("format").equals("hours")).exists().notEmpty(),
    check("multi.*.hours").if(body("format").equals("hours")).exists().notEmpty().isInt(),
    check("multi.*.description").if(body("format").equals("hours")).exists().notEmpty(),
    check("materials.*.description").if(body("format").equals("materials")).exists().notEmpty(),
    check("materials.*.quantity").if(body("format").equals("materials")).exists().notEmpty().isInt(),

    (req,res,next)=>{
        return validateResults(req,res,next)
    }
]

module.exports=validateAlbaran