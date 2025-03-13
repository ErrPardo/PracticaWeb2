const { matchedData } = require('express-validator')
const UserModel=require('../models/users.js')

//TODO cifrar constraseña para cuando se envie
//añadir al usuario los numeritos 
//print(haciendo como se envian las cosas)
//siguiente post de verificacion mandas un email con los numeritos
//comprobar que esta bien y pasarlo
const crearUsuario=async (req,res)=>{
    try{
        body=matchedData(req)
        if(body){
            const result=await UserModel.create(body)
            if(result){
                res.send(result)
            }
            else{
                res.status(400).send("No se ha creado bien el usuario")
            }
        }
        else{
            res.status(400).send("Problemas con el body")
        } 
    }catch(e){
        res.status(500).send("Error con el servidor")
    }

}

module.exports={crearUsuario}