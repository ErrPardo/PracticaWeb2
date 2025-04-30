const { matchedData } = require('express-validator')
const UserModel=require('../models/users.js')
const StorageModel=require('../models/storage.js')
const { encrypt,compare } = require('../utils/handlePassword.js')
const { tokenSign } = require('../utils/handleToken.js')
const {uploadToPinata}=require('../utils/handleUploadIPFS.js')
const crypto = require('crypto')
const { sendEmail } = require('../utils/handleEmail')

//TODO cifrar constraseña para cuando se envie
//añadir al usuario los numeritos 
//print(haciendo como se envian las cosas)
//siguiente post de verificacion mandas un email con los numeritos
//comprobar que esta bien y pasarlo


//devuelve un token
//genera un numero aleatorio y ponemos en el body del usuario
//en el verify pone token en la autorizacion y numero aleatorio en el body, despues cogemos con el token la id y comprobamos ,

const AllUsers=async(req,res)=>{
    const users=await UserModel.find()
    res.send(users)
}

const getUser=async(req,res)=>{
    try{   
        const user=await UserModel.findById(req.user._id).populate('logoId')
        if (!user || user.length === 0) {
            res.status(404).send('No se encontro el usuario');
        }
        else{
            res.send(user)
        } 
    }
    catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}
const comprobarUsuarioVerificado=async(req,res)=>{
    try{
        const user=await UserModel.findOne({"email":req.body.email})
        if (!user || user.length === 0) {
            res.status(404).send('No se encontro el usuario');
        }
        else{
            if(user.estado==true){
                const email={
                    "subject": "Codigo verificacion",
                    "text": user.codigoAleatorio.toString(),
                    "to": "eduardoyc04@gmail.com",
                    "from": "eduardoyc04@gmail.com"
                }
                await sendEmail(email)
                res.send(user.codigoAleatorio.toString())
            }
            else{
                res.status(401).send("El usuario no esta verificado")
            }
        }  
    }
    catch(e){
        console.log(e)
        res.status(500).send("Server internal error")
    }

}
const crearUsuario=async (req,res)=>{
    try{
        req=matchedData(req)
        
        const password=await encrypt(req.password)
        codigoAleatorio=crypto.randomInt(100000, 1000000)
        const email={
            "subject": "Codigo verificacion",
            "text": codigoAleatorio.toString(),
            "to": "eduardoyc04@gmail.com",
            "from": "eduardoyc04@gmail.com"
        }
        await sendEmail(email)

        intentos=0
        const body={...req,password,codigoAleatorio,intentos}
        if(body.company){
            const userCompany=await UserModel.findOne({"company":body.company})
            if(userCompany!=null){
                const result=await UserModel.create(body)
                if(result){
                    result.set('password', undefined, { strict: false })
                    const data={
                        token:await tokenSign(result),
                        user:{
                            password:result.password,
                            role:result.role,
                            intentos:result.intentos,
                            estado:result.estado,
                            deleted:result.deleted,
                        }
                    }
                    res.send(data)
                }
                else{
                    res.status(409).send("El usuario ya existe")
                }
            }
            else{
                res.status(404).send("No existe la compañia introducida")
            } 
        }
        else{
            const result=await UserModel.create(body)
            if(result){
                result.set('password', undefined, { strict: false })
                const data={
                    token:await tokenSign(result),
                    user:{
                        password:result.password,
                        role:result.role,
                        intentos:result.intentos,
                        estado:result.estado,
                        deleted:result.deleted,
                    }
                }
                res.send(data)
            }
            else{
                res.status(409).send("El usuario ya existe")
            }
        }       
    }
    catch(e){
        if(e.code===11000){
            res.status(409).send("duplicate key")
        }
        else{
            res.status(500).send("Server internal error")
        }
    }
}

const modificarUsuarioRegister=async (req,res)=>{
    try{ 
        const estado=true
        const email=req.user.email
        const data={...req.user.toObject(),estado}
        const user=await UserModel.findOneAndReplace({email},data,{returnDocument:'after'}) 
        if (!user || user.length === 0) {
            res.status(404).send('No se encontro el usuario');
        }
        else{
            res.send(user)
        }   
    }
    catch(e){
        console.log(e)
        res.status(500).send("Server internal error")
    }
}

const loginUsuario=async (req,res)=>{
    try{
        req=matchedData(req)
    
        const user=await UserModel.findOne({email:req.email}).select("password name role email")
        if (!user || user.length === 0) {
            res.status(404).send('No se encontro el usuario');
        }
        else{
            const hashPassword=user.password
            const check=await compare(req.password,hashPassword)
            if(check===false){
                res.status(403).send("Error en la comprobacion de la contraseña")
            }
            else{
                const data = {
                    token: await tokenSign(user),
                    user: user
                }
                res.send(data)
            }
        } 
    }
    catch(e){
        console.log(e)
        res.status(500).send("Server internal error")
    }
}

const modificarUsuario=async (req,res)=>{
    try{
        if(!req.headers.authorization){
            res.status(401).send("No hay cabecera/token en la peticion")
        }
        else{
            req.body=matchedData(req)         
            
            var data={}
            const user=await UserModel.findById(req.user._id)
            if(user.autonomo==true && req.body.company){
                if(user.address && user.nif && user.name){
                    const company={
                        "name":user.name,
                        "cif":user.nif,
                        "street": user.address.street,
                        "number": user.address.number,
                        "postal": user.address.postal,
                        "city": user.address.city,
                        "province": user.address.province
                    }
                    data={...req.body,company} 
                }
                else if(req.body.address){
                    data={...req.body}
                }
                else{
                    res.status(403).send("Faltan alguno de estos datos address,nif,name en el usuario")
                }             
            }
            else{
                data={...req.body}
            }
            const resData=await UserModel.findOneAndUpdate({ _id: user._id },data,{returnDocument:'after'})
            res.status(200).send(resData)   
        }
    }
    catch(e){
        res.status(500).send("Server internal error")
    }  
}

const cambiarPassword=async(req,res)=>{
    try{
        req=matchedData(req)
        const password=await encrypt(req.password)
        const data={...req,password}
        const user=await UserModel.findOneAndUpdate({email:req.email},data,{returnDocument:'after'})
        if (!user || user.length === 0) {
            res.status(404).send('No se encontro el usuario');
        }
        else{
            res.send(user)
        } 
    }
    catch(e){
        res.status(500).send(e)
    }
}

const uploadImage = async (req, res,next) => {
    try {
        const id = req.params.id
        const fileBuffer = req.file.buffer
        const fileName = req.file.originalname
        const pinataResponse = await uploadToPinata(fileBuffer, fileName)
        const ipfsFile = pinataResponse.IpfsHash
        const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`
        const data = await StorageModel.create({"filename":fileName,"image":ipfs,"url":ipfs})
        req.body={logoId:data._id}
        next()
    }catch(err) {
        console.log(err)
        res.status(500).send("ERROR_UPLOAD_COMPANY_IMAGE")
    }
}

const deleteUser=async(req,res)=>{
    try{
        const Ruser=req.user
        const { soft } = req.query
        if(soft=="false"){
            const user = await UserModel.findOneAndDelete({"email": Ruser.email})
            if (!user || user.length === 0) {
                res.status(404).send('No se encontro el usuario');
            }
            else{
                res.send(user)
            } 
        }
        else{
            const user=await UserModel.findOneAndUpdate({"email":Ruser.email},{Ruser,deleted:true},{ new: true })
            if (!user || user.length === 0) {
                res.status(404).send('No se encontro el usuario');
            }
            else{
                res.send(user)
            } 
        }    
    }
    catch(e){
        console.log(e)
        res.status(500).send("Server internal error")
    }
}

const recoverPassword=async(req,res)=>{
    try{  
        req.body=matchedData(req)    
        const user=await UserModel.findOne({email:req.body.email}).select("estado role email")      
        if (!user || user.length === 0) {
            res.status(404).send('No se encontro el usuario');
        }
        else{
            const data = {
                token: await tokenSign(user),
                user: user
            }
            res.send(data)  
        }
    }
    catch(e){
        console.log(e)
        res.status(500).send("Server internal error")
    }
}


module.exports={crearUsuario,modificarUsuarioRegister,loginUsuario,modificarUsuario,getUser,uploadImage,deleteUser,recoverPassword,comprobarUsuarioVerificado,cambiarPassword,AllUsers}