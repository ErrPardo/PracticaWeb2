const { matchedData } = require('express-validator')
const ProjectModel=require('../models/projects')
const ClientModel=require('../models/client')

const crearProject=async(req,res)=>{
    try{
        req.body=matchedData(req)
        const clientMongo=req.body.clientId
        if((await ClientModel.find({_id:clientMongo})).length!=0){
            const id=req.user._id
            req.body={...req.body,userId:id}
            const project=await ProjectModel.find({"userId":id,"clientId":clientMongo,"projectCode":req.body.projectCode})
            if(project.length===0){
                const newProject=await ProjectModel.create(req.body)
                res.send(newProject)
            }
            else{
                res.status(409).send("El proyecto ya existe para esta usuario")
            } 
        }
        else{
            res.status(404).send("El cliente que ha seleccionado no existe")
        }   
    }
    catch(e){
        console.log(e)
        res.status(500).send("Server internal error")
    }
}

const getProjects=async (req,res)=>{
    try{
        const id=req.user._id
        const project=await ProjectModel.find({"userId":id})
        if (!project || project.length === 0) {
            res.status(404).send('No se encontraron proyectos para este usuario');
        }
        else{
            res.send(project)
        }
    }
    catch(e){
        console.log(e)
        res.status(500).send("Server internal error")
    }
}

const getOneProjectById=async(req,res)=>{
    try{
        if(req.params.id=="archive"){
            const id=req.user._id
            const project=await ProjectModel.findWithDeleted({"userId":id,deleted:true})
            if (!project || project.length === 0) {
                res.status(404).send('No se encontraron proyectos para este usuario');
            }
            else{
                res.send(project)
            }
        }
        else{
            const id=req.user._id
            const project=await ProjectModel.findOne({"userId":id, "_id":req.params.id})
            if (!project || project.length === 0) {
                res.status(404).send('No se encontraron proyectos para este usuario');
            }
            else{
                res.send(project)
            }
        }  
    }
    catch(e){
        console.log(e)
        res.status(500).send("Server internal error")
    }
}

const deleteProject=async(req,res)=>{
    try{
        const id=req.user._id
        if(!req.path.includes("archive")){
            const project = await ProjectModel.findOneAndDelete({"userId":id, "_id":req.params.id})
            if (!project) {
                return res.status(404).send('Proyecto no encontrado o ya eliminado');
              }
            else{
                res.send(project)
            }
        }
        else{
            const project=await ProjectModel.findOne({"userId":id, "_id":req.params.id})
            if (!project || project.length === 0) {
                res.status(404).send('Proyecto no encontrado');
            }
            else{
                const result=await ProjectModel.delete({"userId":id, "_id":req.params.id},{ new: true })
                res.send(result)
            }
        } 
    }
    catch(e){
        console.log(e)
        res.status(500).send("Server internal error")
    }
}

const restoreProject=async(req,res)=>{
    try{
        const id=req.user._id
        const result=await ProjectModel.updateOneWithDeleted({"userId":id,"_id":req.params.id},{ $set: { deleted: false } },{ new: true })
        if (result.matchedCount === 0 && result.modifiedCount === 0) {
            return res.status(404).send('proyecto no encontrado');
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

const modificarProject=async(req,res)=>{
    try{
        req.body=matchedData(req)
        const id=req.user._id
        const clientMongo=req.body.clientId
        if((await ClientModel.find({_id:clientMongo})).length!=0){
            req.body={...req.body,userId:id,clientId:clientMongo}
            const data=req.body
            const restored=await ProjectModel.findOneAndReplace({"_id":req.params.id},data,{ new: true })
            if(!restored){
                res.status(404).send('Proyecto no encontrado')
            }
            else{
                res.send(restored)
            }
        }
        else{
            res.status(404).send("El cliente que ha seleccionado no existe")
        }       
    }
    catch(e){
        console.log(e)
        res.status(500).send("Server internal error")
    }
}


module.exports={crearProject,getProjects,getOneProjectById,deleteProject,restoreProject,modificarProject}