const express=require("express")
const cors=require("cors")
require('dotenv').config()

//const dbConnect=require('/config/mongo')
const app=express()

app.use(cors())
app.use(express.json())

const port=process.env.PORT
app.listen(port,()=>{
    console.log('Servidor iniciado, en el puerto ',port)
})
