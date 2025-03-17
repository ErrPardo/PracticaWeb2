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
            console.log(password)
            const body={...req,password}
            const result=await UserModel.create(body)
            if(result){
                result.set('password', undefined, { strict: false })
                const data={
                    token:await tokenSign(result),
                    intentos:3,
                    codigoAleatorio:crypto.randomInt(100000, 1000000),
                    user:result
                }
                res.send(data)
            }
            else{
                res.status(400).send("No se ha creado bien el usuario")
            }
        }
        else{
            res.status(400).send("Problemas con el body")
        } 
    }
    catch(e){
        res.status(500).send(e)
    }

}

module.exports={crearUsuario}