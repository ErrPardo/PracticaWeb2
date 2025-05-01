const express=require('express')

const { crearProject, getProjects, getOneProjectById, deleteProject,restoreProject,modificarProject } = require('../controllers/projects')
const authMiddleware=require('../middleware/authMiddleware')
const { validatorProject } = require('../validators/projectValidator')

const routerP=express.Router()
routerP.use(express.json())


/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: API for managing projects
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Project created
 *       403:
 *         description: Validation error or missing fields
 *       409:
 *         description: Project already exists
 *       500:
 *         description: Internal server error
 */
routerP.post("/", authMiddleware, validatorProject, crearProject)

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of projects
 *       404:
 *         description: No projects found
 *       500:
 *         description: Internal server error
 */
routerP.get("/", authMiddleware, getProjects)

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project data
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
routerP.get("/:id", authMiddleware, getOneProjectById)

/**
 * @swagger
 * /api/projects/archive/{id}:
 *   delete:
 *     summary: Logical delete of a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project marked as deleted
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
routerP.delete("/archive/:id", authMiddleware, deleteProject)

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Permanently delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
routerP.delete("/:id", authMiddleware, deleteProject)

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Project updated
 *       403:
 *         description: Validation error
 *       404:
 *         description: Project or client not found
 *       409:
 *         description: Duplicate project code
 *       500:
 *         description: Internal server error
 */
routerP.put("/:id", authMiddleware, validatorProject, modificarProject )

/**
 * @swagger
 * /api/projects/restore/{id}:
 *   patch:
 *     summary: Restore a logically deleted project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project restored
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
routerP.patch("/restore/:id", authMiddleware, restoreProject)

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - name
 *         - projectCode
 *         - code
 *         - clientId
 *         - address
 *       properties:
 *         name:
 *           type: string
 *           example: "Nombre del proyecto" 
 *         projectCode:
 *           type: string
 *           example: "Identificador de proyect"
 *         code:
 *           type: string
 *           example: "Código interno del proyecto"
 *         clientId:
 *           type: string
 *           example: "mongoId"
 *         address:
 *           $ref: '#/components/schemas/address'
 */

module.exports=routerP

