const multer = require("multer")

const storage=multer.diskStorage({//guardar los datos en disco
    destination:function(req,file,callback){
        const pathStorage=__dirname+"/../storage"//que carpeta lo guardamos
        callback(null,pathStorage) //primer parametro es de error, segundo es nombre de la carpeta
    },
    filename:function(req,file,callback){
        const ext=file.originalname.split(".").pop()
        const filename="file-"+Date.now()+"."+ext
        callback(null,filename)
    }
})
const uploadMiddleware=multer({storage})

const memory=multer.memoryStorage()
const uploadMiddlewareMemory=multer({storage:memory,limits:{fileSize:5*1024*1024}})

module.exports={uploadMiddleware,uploadMiddlewareMemory}