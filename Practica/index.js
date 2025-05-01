const express=require("express")
const cors=require("cors")
const swaggerUi=require("swagger-ui-express")
const swaggerSpecs=require("./docs/swagger.js")
require('dotenv').config()
router=require('./routers/index')

const morganBody = require("morgan-body")
const loggerStream = require("./utils/handleLog")

const dbConnect=require('./config/mongo')
const app=express()

morganBody(app, {
    noColors: true, //limpiamos el String de datos lo máximo posible antes de mandarlo a Slack
    skip: function(req, res) { //Solo enviamos errores (4XX de cliente y 5XX de servidor)
        return res.statusCode < 400
    },
    stream: loggerStream
})

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