const mongoose=require('mongoose')

const ClientScheme=new mongoose.Schema(
    {
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
        logoId:{
            type:mongoose.Types.ObjectId,
            ref:'storages'
        },
        userId:{
            type:mongoose.Types.ObjectId
        },
        name:{
            type:String
        },
        cif:{
            type:String
        }  
    }
    ,{
        timestamps: true,
        versionKey: false
    }
)

module.exports=mongoose.model("clients",ClientScheme)