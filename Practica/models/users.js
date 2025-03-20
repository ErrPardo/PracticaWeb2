const mongoose=require('mongoose')
const mongooseDelete=require("mongoose-delete")

const UserModel=new mongoose.Schema(
    {
        email:{
            type:String,
            unique:true
        },
        password:{
            type:String
        },
        role:{
            type: ["user", "admin"],
            default: "user"
        },
        codigoAleatorio:{
            type:Number
        },
        intentos:{
            type:Number
        },
        estado:{
            type:Boolean,
            default:false
        },
        name:{
            type:String
        },
        surnames:{
            type:String
        },
        nif:{
            type:String
        },
        company:{
            name:{
                type:String
            },
            cif:{
                type:String
            },
            street:{
                type:String
            },
            number:{
                type:Number
            },
            postal:{
                type:Number
            },
            city:{
                type:String
            },
            province:{
                type:String
            }
        },
        logoId:{
            type:mongoose.Types.ObjectId,
            ref:'storages'
        }
    }
    ,
    {
        timestamps: true,
        versionKey: false
    }
)
UserModel.plugin(mongooseDelete,{overrideMethods:"all"})
module.exports=mongoose.model("users",UserModel)