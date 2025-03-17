const { matchedData } = require('express-validator')
const UserModel=require('../models/users.js')
const { encrypt,compare } = require('../utils/handlePassword.js')
const { tokenSign } = require('../utils/handleToken.js')
const crypto = require('crypto');

//TODO cifrar constraseña para cuando se envie
//añadir al usuario los numeritos 
//print(haciendo como se envian las cosas)
//siguiente post de verificacion mandas un email con los numeritos
//comprobar que esta bien y pasarlo


//devuelve un token
//genera un numero aleatorio y ponemos en el body del usuario
//en el verify pone token en la autorizacion y numero aleatorio en el body, despues cogemos con el token la id y comprobamos , 
const crearUsuario=async (req,res)=>{
    try{
        req=matchedData(req)
        if(req){
            const password=await encrypt(req.password)
            codigoAleatorio=crypto.randomInt(100000, 1000000)
            intentos=3
            const body={...req,password,codigoAleatorio,intentos}
            const result=await UserModel.create(body)
            if(result){
                result.set('password', undefined, { strict: false })
                const data={
                    token:await tokenSign(result),
                    user:result
                }
                res.send(data)
            }
            else{
                res.status(409).send("El usuario ya existe")
            }
        }
        else{
            res.status(400).send("Problemas con el body")
        } 
    }
    catch(e){
        if(e.code===11000){
            res.status(409).send("duplicate key")
        }
        else{
            res.status(500).send(e)
        }
    }
}

const modificarUsuario= async (req,res)=>{
    try{ 
        const estado=true
        const email=req.user.email
        const data={...req.user.toObject(),estado}
        const newUser=await UserModel.findOneAndReplace({email},data,{returnDocument:'after'}) 
        res.send(newUser)  
    }
    catch(e){
        res.status(500).send(e)
    }
}

const loginUsuario=(req,res,next)=>{

}

module.exports={crearUsuario,modificarUsuario,loginUsuario}