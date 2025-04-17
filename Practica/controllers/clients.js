const { matchedData } = require('express-validator')
const ClientModel=require('../models/client')

const crearClient=async(req,res)=>{
    try{
        req.body=matchedData(req)
        if(req.body){
            const id=req.user._id
            req.body={...req.body,userId:id}
            const client=await ClientModel.find(req.body)
            if(client.length===0){
                const newClient=await ClientModel.create(req.body)
                res.send(newClient)
            }
            else{
                res.status(422).send("El cliente ya existe para esta usuario")
            } 
        }
        else{
            res.status(401).send("Problemas con el body")
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
        const id=req.user._id
        const client=await ClientModel.find({"userId":id, _id:req.params.id})
        res.send(client)
    }
    catch(e){
        console.log(e)
        res.status(500).send(e)
    }
}


module.exports={crearClient,getClients,getOneClientById}