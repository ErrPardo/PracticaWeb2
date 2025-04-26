const { matchedData } = require('express-validator')
const AlbaranModel=require('../models/albaran')
const ClientModel=require('../models/client')
const ProjectModel=require('../models/projects')
const uploadToPinata=require('../utils/handleUploadIPFS.js')


const crearAlbaran=async(req,res)=>{
    try{
        req.body=matchedData(req)
        if((await ClientModel.find({_id:req.body.clientId}))!=0 && (await ProjectModel.find({_id:req.body.projectId}))!=0){
            const id=req.user._id
            req.body={...req.body,userId:id,pending:true,sign:"null"}
            const albaran=await AlbaranModel.find({"userId":id,"clientId":req.body.clientId,"projectId":req.body.projectId,"albaranCode":req.body.albaranCode})
            if(albaran.length===0){
                const newAlbaran=await AlbaranModel.create(req.body)
                res.send(newAlbaran)
            }
            else{
                res.status(409).send("El albaran proporcionado ya existe")
            }
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

const getAllAlbaranes=async(req,res)=>{
    try{
        const id=req.user._id
        const albaran=await AlbaranModel.find({"userId":id})
        if(!albaran || albaran.length===0){
            res.status(404).send("El usuario no tiene albaranes")
        }
        else{
            res.send(albaran)
        }
    }
    catch(e){
        console.log(e)
        res.status(500).send("Server internal error")
    }

}

const getOneAlbaranById=async(req,res)=>{
    try{
        const id=req.user._id
        const albaran=await AlbaranModel.findOne({"userId":id, "_id":req.params.id}).populate("clientId").populate("userId").populate("projectId")
        if(!albaran || albaran.length===0){
            res.status(404).send("El albaran proporcionado no existe")
        }
        else{
            res.send(albaran)
        }
    }
    catch(e){
        console.log(e)
        res.status(500).send("Server internal error")
    }
}

const deleteAlbaran=async(req,res)=>{
    try{
        const id=req.user._id
        const albaran=await AlbaranModel.findOne({"userId":id, "_id":req.params.id})
        if(!albaran || albaran.length===0){
            res.status(404).send("El albaran proporcionado no existe o ya esta eliminado")
        }
        else{
            if(albaran.sign!="null"){
                res.status(403).send("No se puede borrar un albaran firmado")
            }
            else{
                const result=await AlbaranModel.deleteOne({_id:albaran._id})
                res.send(result)
            }
        }
    }
    catch(e){
        console.log(e)
        res.status(500).send("Server internal error")
    }
}

const uploadFile=async(req,res)=>{
    try {
        const id = req.params.id
        const signature = req.file
        const pdf=req.pdf
        
        const signBuffer = signature.buffer
        const signName = signature.originalname

        const pinataSign = await uploadToPinata(signBuffer, signName)
        const ipfsSign = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${pinataSign.IpfsHash}`

        await AlbaranModel.findByIdAndUpdate(req.albaran._id, { sign: ipfsSign }, { new: true })
        
        const pdfBuffer = pdf.buffer
        const pdfName = pdf.originalname
    
        const pinataPdf = await uploadToPinata(pdfBuffer, pdfName)
        const ipfsPdf = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${pinataPdf.IpfsHash}`
    
        await AlbaranModel.findByIdAndUpdate(req.albaran._id, { pdf: ipfsPdf }, { new: true })
        
      
        res.send(ipfsPdf)

    }catch(err) {
        console.log(err)
        res.status(500).send("ERROR_UPLOAD_COMPANY_IMAGE")
    }
}


module.exports={crearAlbaran,getAllAlbaranes,getOneAlbaranById,deleteAlbaran,uploadFile}

