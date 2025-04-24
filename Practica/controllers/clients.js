const { matchedData } = require('express-validator')
const ClientModel=require('../models/client')


const crearClient=async(req,res)=>{
    try{
        req.body=matchedData(req)    
        const id=req.user._id
        req.body={...req.body,userId:id}
        const client=await ClientModel.find({"userId":id,"cif":req.body.cif})
        if(client.length===0){
            const newClient=await ClientModel.create(req.body)
            res.send(newClient)
        }
        else{
            res.status(409).send("El cliente ya existe para esta usuario")
        }  
    }
    catch(e){
        console.log(e)
        res.status(500).send("Server internal error")
    }
}

const getClients=async (req,res)=>{
    try{
        const id=req.user._id
        const client=await ClientModel.find({"userId":id})
        if (!client || client.length === 0) {
            res.status(404).send('No se encontraron clientes para este usuario');
        }
        else{
            res.send(client)
        }
    }
    catch(e){
        console.log(e)
        res.status(500).send("Server internal error")
    }
}

const getOneClientById=async (req,res)=>{
    try{
        if(req.params.id=="archive"){
            const id=req.user._id
            const client=await ClientModel.findWithDeleted({"userId":id,deleted:true})
            if (!client || client.length === 0) {
                res.status(404).send('No se encontraron clientes para este usuario');
            }
            else{
                res.send(client)
            }
        }
        else{
            const id=req.user._id
            const client=await ClientModel.findOne({"userId":id, "_id":req.params.id})
            if (!client || client.length === 0) {
                res.status(404).send('No se encontraron clientes para este usuario o no existe ese usuario');
            }
            else{
                res.send(client)
            }
        }  
    }
    catch(e){
        console.log(e)
        res.status(500).send("Server internal error")
    }
}

const deleteClient=async(req,res)=>{
    try{
        const id=req.user._id
        if(!req.path.includes("archive")){
            const data = await ClientModel.findOneAndDelete({"userId":id, "_id":req.params.id})
            if (!data) {
                return res.status(404).send('Cliente no encontrado o ya eliminado');
              }
            else{
                res.send(data)
            }
        }
        else{
            const client=await ClientModel.findOneAndUpdate({"userId":id, "_id":req.params.id},{deleted:true},{ new: true })
            if (!client || client.length === 0) {
                res.status(404).send('Cliente no encontrado');
            }
            else{
                res.send(client)
            }
        } 
    }
    catch(e){
        console.log(e)
        res.status(500).send("Server internal error")
    }
}

const restoreClient=async(req,res)=>{
    try{
        const id=req.user._id
        const result=await ClientModel.updateOneWithDeleted({"userId":id,"_id":req.params.id},{ $set: { deleted: false } },{ new: true })
        if (result.matchedCount === 0 && result.modifiedCount === 0) {
            return res.status(404).send('Cliente no encontrado');
        }
        else{
            res.send(result)
        }       
    }
    catch(e){
        console.log(e)
        res.status(500).send("Server internal error")
    }
}

const modificarClient=async(req,res)=>{
    try{
        req.body=matchedData(req)
        const id=req.user._id
        req.body={...req.body,userId:id}
        const data=req.body
        const restored=await ClientModel.findOneAndReplace({"userId":id,"_id":req.params.id},data,{ new: true })
        if(!restored){
            res.status(404).send('Cliente no encontrado')
        }
        else{
            res.send(restored)
        }   
    }
    catch(e){
        console.log(e)
        res.status(500).send("Server internal error")
    }
}


module.exports={crearClient,getClients,getOneClientById,deleteClient,restoreClient,modificarClient}