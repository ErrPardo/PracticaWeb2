const mongoose=require('mongoose')

const UserModel=new mongoose.Schema(
    {
        email:{
            type:String
        },
        password:{
            type:String,
            unique:true
        },
        role:{
            type: ["user", "admin"], // es el enum de SQL
            default: "user"
        },
        codigoAleatorio:{
            type:String
        }
    }
)

module.exports=mongoose.model("users",UserModel)