const { verifyToken } = require("../utils/handleToken")
const UserModel=require('../models/users.js')

const authMiddleware= async (req,res,next)=>{
    try{     
        if(!req.headers.authorization){
            res.status(401).send("No hay cabecera en la peticion")
        }
        else{
            const token=req.headers.authorization.match(/Bearer\s(\S+)/)[1]
            const tokenData=await verifyToken(token)
            if(tokenData){
                const user=await UserModel.findById(tokenData._id)
                req.user=user
                next()
            }
            else{
                res.status(403).send("Error con el token")
            }
        }  
    }
    catch(e){
        res.status(500).send("Error con la peticion middleware")
    }
    

}

module.exports=authMiddleware