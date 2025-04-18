const mongoose=require('mongoose')
const mongooseDelete=require("mongoose-delete")

const ProjectModel=new mongoose.Schema(
    {
        name:{
            type:String
        },
        address: {
            street:{
                type:String
            },
            number:{
                type:Number
            },
            postal:{
                type:Number
            } ,
            city:{
                type:String
            },
            province:{
                type:String
            },
        },
        projectCode:{
            type:String,
            unique:true
        },
        code:{
            type:String
        },
        userId:{
            type:mongoose.Types.ObjectId
        },
        clientId:{
            type:mongoose.Types.ObjectId
        },
        notes:{
            type:String
        },
        begin:{
            type:String
        },
        end:{
            type:String
        }
    }
    ,{
        timestamps: true,
        versionKey: false
    }
)

ProjectModel.plugin(mongooseDelete,{overrideMethods:"all"})
module.exports=mongoose.model("projects",ProjectModel)