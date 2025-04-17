const express=require("express")
const cors=require("cors")
const swaggerUi=require("swagger-ui-express")
const swaggerSpecs=require("./docs/swagger.js")
require('dotenv').config()
router=require('./routers/index')

const dbConnect=require('./config/mongo')
const app=express()

app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpecs))
app.use(cors())
app.use(express.json())

app.use(router)

const port=process.env.PORT
const server=app.listen(port,()=>{
    console.log('Servidor iniciado, en el puerto ',port)
})
dbConnect()

module.exports={app,server}