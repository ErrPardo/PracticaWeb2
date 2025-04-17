const mongoose=require('mongoose')

const dbConnect=()=>{
    const db_uri = process.env.NODE_ENV === 'test' ? process.env.DB_URI_TEST:
    process.env.DB_URI

    mongoose.set('strictQuery',false)
    console.log(db_uri)
    try{
        mongoose.connect(db_uri)
    }catch(error){
        console.error("Error conectadndo a la BD",error)
    }
    mongoose.connection.on("connected",()=>console.log("Conectado a la BD"))
}

module.exports=dbConnect