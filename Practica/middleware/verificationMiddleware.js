const { verifyToken } = require("../utils/handleToken")
const UserModel=require('../models/users.js')
const { matchedData } = require("express-validator")

const verificationMiddleware= async (req,res,next)=>{
    try{ 
        req.body=matchedData(req)
        if(!req.headers.authorization){
            res.status(401).send("No hay cabecera/token en la peticion")
        }
        else{
            const token=req.headers.authorization.match(/Bearer\s(\S+)/)[1]
            const tokenData=await verifyToken(token)
            if(tokenData){
                const user=await UserModel.findById(tokenData._id)
                
                if(user.codigoAleatorio===req.body.code){
                    req.user=user
                    next()
                }
                else{
                    res.status(403).send("Error en el codigo de verificacion")
                }
            }
            else{
                res.status(403).send("Error con el token")
            }
        }  
    }
    catch(e){
        res.status(500).send(e)
    }
    

}

module.exports=verificationMiddleware