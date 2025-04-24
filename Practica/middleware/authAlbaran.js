const AlbaranModel=require('../models/albaran')

const authAlbaran=async(req,res,next)=>{
    try{
        const id=req.user._id
        const albaran=await AlbaranModel.findOne({"userId":id, "_id":req.params.id}).populate("clientId").populate("userId").populate("projectId")
        if(!albaran || albaran.length===0){
            res.status(404).send("El albaran proporcionado no existe")
        }
        else{
            req.albaran=albaran
            next()
        }
    }
    catch(e){
        console.log(e)
        res.status(500).send("Server internal error")
    }
}

module.exports=authAlbaran