const { matchedData } = require('express-validator')
const UserModel=require('../models/users.js')
const StorageModel=require('../models/storage.js')
const { encrypt,compare } = require('../utils/handlePassword.js')
const { tokenSign,verifyToken } = require('../utils/handleToken.js')
const uploadToPinata=require('../utils/handleUploadIPFS.js')
const crypto = require('crypto');

//TODO cifrar constraseña para cuando se envie
//añadir al usuario los numeritos 
//print(haciendo como se envian las cosas)
//siguiente post de verificacion mandas un email con los numeritos
//comprobar que esta bien y pasarlo


//devuelve un token
//genera un numero aleatorio y ponemos en el body del usuario
//en el verify pone token en la autorizacion y numero aleatorio en el body, despues cogemos con el token la id y comprobamos ,


const getUser=async(req,res)=>{
    try{
        if(!req.headers.authorization){
            res.status(401).send("No hay cabecera/token en la peticion")
        }
        else{
            const token=req.headers.authorization.match(/Bearer\s(\S+)/)[1]
            const tokenData=await verifyToken(token)
            if(tokenData){
                const user=await UserModel.findById(tokenData._id).populate('logoId')
                res.send(user)
            }
        }
    }
    catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}
const crearUsuario=async (req,res)=>{
    try{
        req=matchedData(req)
        if(req){
            const password=await encrypt(req.password)
            codigoAleatorio=crypto.randomInt(100000, 1000000)
            intentos=0
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

const modificarUsuarioRegister=async (req,res)=>{
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

const loginUsuario=async (req,res)=>{
    try{
        req=matchedData(req)
        if(!req){
            res.status(409).send("error con el body")
        }
        else{
            const user=await UserModel.findOne({email:req.email}).select("password name role email")
            if(!user){
                res.status(403).send("No se ha encontrado el usuario")
            }
            else{
                const hashPassword=user.password
                const check=compare(req.password,hashPassword)
                if(!check){
                    res.satus(403).send("Error en la comprobacion de la contraseña")
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
    }
    catch(e){
        res.status(500).send(e)
    }
}

const modificarUsuario=async (req,res)=>{
    try{
        if(!req.headers.authorization){
            res.status(401).send("No hay cabecera/token en la peticion")
        }
        else{
            req.body=matchedData(req)         
            if(req.body){
                const token=req.headers.authorization.match(/Bearer\s(\S+)/)[1]
                const tokenData=await verifyToken(token)
                if(tokenData){
                    const user=await UserModel.findByIdAndUpdate(tokenData._id,req.body,{returnDocument:'after'})
                    res.status(200).send(user)
                }   
            }
            else{
                res.status(403).send("Problemas con el body")
            }
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
        console.log(fileBuffer)
        const fileName = req.file.originalname
        //const pinataResponse = await uploadToPinata(fileBuffer, fileName)
        //const ipfsFile = pinataResponse.IpfsHash
        //const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`
        //const data = await StorageModel.create({"filename":fileName,"image":ipfs,"url":ipfs})
        //req.body={logoId:data._id}
        //next()
        res.send("ok")
    }catch(err) {
        console.log(err)
        res.status(500).send("ERROR_UPLOAD_COMPANY_IMAGE")
        //handleHttpError(res, "ERROR_UPLOAD_COMPANY_IMAGE")
    }
}

const deleteUser=async(req,res)=>{
    try{
        const user=req.user
        const { soft } = req.query
        if(soft=="false"){
            const data = await UserModel.findOneAndDelete({"email": user.email})
            res.send(data)
        }
        else{
            const newUser=await UserModel.findOneAndUpdate({"email":user.email},{user,deleted:true},{ new: true })
            res.send(newUser)
        }
        
    }
    catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}

const recoverPassword=async(req,res)=>{
    try{  
        console.log(req.body)     
        const user=await UserModel.findOne({email:req.body.email}).select("estado role email")      
        if(!user){
            res.status(403).send("No se ha encontrado el usuario")
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
        res.status(500).send(e)
    }
}


module.exports={crearUsuario,modificarUsuarioRegister,loginUsuario,modificarUsuario,getUser,uploadImage,deleteUser,recoverPassword}