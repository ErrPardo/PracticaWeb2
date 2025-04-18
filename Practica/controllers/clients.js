const { matchedData } = require('express-validator')
const ClientModel=require('../models/client')


const crearClient=async(req,res)=>{
    try{
        req.body=matchedData(req)
        if(req.body){
            const id=req.user._id
            req.body={...req.body,userId:id}
            const client=await ClientModel.find({"cif":req.body.cif})
            if(client.length===0){
                const newClient=await ClientModel.create(req.body)
                res.send(newClient)
            }
            else{
                res.status(409).send("El cliente ya existe para esta usuario")
            } 
        }
        else{
            res.status(422).send("Problemas con el body")
        }
    }
    catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}

const getClients=async (req,res)=>{
    try{
        const id=req.user._id
        const client=await ClientModel.find({"userId":id})
        res.send(client)
    }
    catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}

const getOneClientById=async (req,res)=>{
    try{
        if(req.params.id=="archive"){
            const id=req.user._id
            const client=await ClientModel.findWithDeleted({"userId":id,deleted:true})
            res.send(client)
        }
        else{
            const id=req.user._id
            const client=await ClientModel.find({"userId":id, "_id":req.params.id})
            res.send(client)
        }  
    }
    catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}

const deleteClient=async(req,res)=>{
    try{
        const id=req.user._id
        if(!req.path.includes("archive")){
            const data = await ClientModel.findOneAndDelete({"userId":id, "_id":req.params.id})
            res.send(data)
        }
        else{
            const client=await ClientModel.findOneAndUpdate({"userId":id, "_id":req.params.id},{deleted:true},{ new: true })
            res.send(client)
        }
        
    }
    catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}

const restoreClient=async(req,res)=>{
    try{
        const id=req.user._id
        const restored=await ClientModel.updateOneWithDeleted({"userId":id,"_id":req.params.id},{ $set: { deleted: false } },{ new: true })
        res.send(restored)  
    }
    catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}

const modificarClient=async(req,res)=>{
    try{
        req.body=matchedData(req)
        if(req.body){
            const id=req.user._id
            req.body={...req.body,userId:id}
            const data=req.body
            const restored=await ClientModel.findOneAndReplace({"_id":req.params.id},data,{ new: true })
            res.send(restored)
        }
        else{
            res.status(422).send("Problemas con el body")
        }  
    }
    catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}


module.exports={crearClient,getClients,getOneClientById,deleteClient,restoreClient,modificarClient}