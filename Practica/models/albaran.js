const mongoose=require('mongoose')
const mongooseDelete=require("mongoose-delete")

const AlbaranModel=new mongoose.Schema(
    {
        albaranCode:{
            type:String,
            unique:true
        },
        userId:{
            type:mongoose.Types.ObjectId,
            ref:'User'
        },
        projectId:{
            type:mongoose.Types.ObjectId,
            ref:'Project'
        },
        clientId:{
            type:mongoose.Types.ObjectId,
            ref:'Client'
        },
        workdate:{
            type:Date,
            default:Date.now
        },
        description:{
            type:String
        },
        format:{
            type:["hours", "materials"]
        },
        hours:{
            type:Number
        },
        pending:{
            type:Boolean
        },
        sign:{
            type:String
        },
        pdf:{
            type:String
        },
        multi:[
            {
                name:{
                    type:String
                },
                hours:{
                    type:Number
                },
                description:{
                    type:String
                }
            }
        ],
        materials:[
            {
                description:{
                    type:String
                },
                quantity:{
                    type:Number
                }
            }
                
        ]
    }
    ,{
        timestamps: true,
        versionKey: false
    }
)
AlbaranModel.plugin(mongooseDelete,{overrideMethods:"all"})
module.exports=mongoose.model("Albaran",AlbaranModel)