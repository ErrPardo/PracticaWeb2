const express=require('express')

const { crearProject, getProjects, getOneProjectById, deleteProject,restoreProject,modificarProject } = require('../controllers/projects')
const authMiddleware=require('../middleware/authMiddleware')
const { validatorProject } = require('../validators/projectValidator')

const routerP=express.Router()
routerP.use(express.json())


routerP.get('/',authMiddleware,getProjects)

routerP.get('/:id',authMiddleware,getOneProjectById)

routerP.delete('/archive/:id',authMiddleware,deleteProject)

routerP.delete('/:id',authMiddleware,deleteProject)

routerP.post('/',validatorProject,authMiddleware,crearProject)

routerP.put('/:id',validatorProject,authMiddleware,modificarProject)

routerP.patch('/restore/:id',authMiddleware,restoreProject)


module.exports=routerP

