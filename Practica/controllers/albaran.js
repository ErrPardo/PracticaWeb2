const { matchedData } = require('express-validator')
const AlbaranModel=require('../models/albaran')
const ClientModel=require('../models/client')
const ProjectModel=require('../models/projects')


const crearAlbaran=async(req,res)=>{
    try{
        req.body=matchedData(req)
        if((await ClientModel.find({_id:req.body.clientId}))!=0 && (await ProjectModel.find({_id:req.body.projectId}))!=0){
            const id=req.user._id
            req.body={...req.body,userId:id,pending:true}
            const albaran=await AlbaranModel.create(req.body)
            res.send(albaran)
        }
        else{
            res.status(404).send("No existe el cliente proporcionado o el proyecto")
        }
    }
    catch(e){
        console.log(e)
        res.status(500).send("Server internal error")
    }
}


module.exports={crearAlbaran}

