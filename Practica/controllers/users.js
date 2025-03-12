const UserModel=require('../models/users.js')

//TODO cifrar constraseña para cuando se envie
//añadir al usuario los numeritos 
//print(haciendo como se envian las cosas)
//siguiente post de verificacion mandas un email con los numeritos
//comprobar que esta bien y pasarlo
const crearUsuario=(req,res)=>{
    try{
        const result=UserModel.create(req.body)
        if(result){
            res.status(200).json(result)
        }
        else{
            res.status(400).send("No se ha creado bien el usuario")
        }
    }catch(e){
        res.status(500).send("Error con el servidor")
    }

}

module.exports={crearUsuario}