const express=require('express')
const authMiddleware = require('../middleware/authMiddleware')
const validateAlbaran = require('../validators/albaranValidator')
const { crearAlbaran, getAllAlbaranes, getOneAlbaranById, deleteAlbaran, uploadFile } = require('../controllers/albaran')
const { uploadMiddlewareMemory } = require('../utils/handlestorage.js')
const handlePdf=require('../utils/handlePdf')
const authAlbaran=require('../middleware/authAlbaran')

const routerAlbaran=express.Router()
routerAlbaran.use(express.json())

/**
 * @swagger
 * /api/albaran:
 *   post:
 *     summary: Crear un albarán
 *     tags: [Albaran]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Albaran'
 *     responses:
 *       200:
 *         description: Albarán creado correctamente
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: Datos inválidos o token expirado
 *       404:
 *         description: Cliente o proyecto no encontrado
 *       409:
 *         description: El albarán ya existe
 */
routerAlbaran.post('/', validateAlbaran, authMiddleware, crearAlbaran)

/**
 * @swagger
 * /api/albaran:
 *   get:
 *     summary: Obtener todos los albaranes
 *     tags: [Albaran]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de albaranes
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: Token expirado o inválido
 *       404:
 *         description: No se encontraron albaranes
 */
routerAlbaran.get('/', authMiddleware, getAllAlbaranes)

/**
 * @swagger
 * /api/albaran/{id}:
 *   get:
 *     summary: Obtener un albarán por ID
 *     tags: [Albaran]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del albarán
 *     responses:
 *       200:
 *         description: Albarán encontrado
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: Token expirado o inválido
 *       404:
 *         description: Albarán no encontrado
 */
routerAlbaran.get('/:id', authMiddleware, getOneAlbaranById)

/**
 * @swagger
 * /api/albaran/pdf/{id}:
 *   get:
 *     summary: Obtener el PDF firmado de un albarán
 *     tags: [Albaran]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del albarán
 *         schema:
 *           type: string
 *       - in: formData
 *         name: image
 *         type: file
 *         description: Imagen de la firma
 *     responses:
 *       200:
 *         description: PDF generado y firmado
 *       201:
 *         description: Albarán ya estaba firmado
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: Token expirado o no autorizado
 *       404:
 *         description: Albarán no encontrado
 */
routerAlbaran.get('/pdf/:id', authMiddleware, authAlbaran, handlePdf, uploadMiddlewareMemory.single('image'), uploadFile)

/**
 * @swagger
 * /api/albaran/{id}:
 *   delete:
 *     summary: Eliminar un albarán por ID
 *     tags: [Albaran]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del albarán
 *     responses:
 *       200:
 *         description: Albarán eliminado
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: Token expirado o albarán firmado
 *       404:
 *         description: Albarán no encontrado
 */
routerAlbaran.delete('/:id', authMiddleware, deleteAlbaran)

/**
 * @swagger
 * tags:
 *   name: Albaran
 *   description: Gestión de albaranes

 * components:
 *   schemas:
 *     Albaran:
 *       type: object
 *       required:
 *         - albaranCode
 *         - clientId
 *         - projectId
 *         - description
 *         - format
 *       properties:
 *         albaranCode:
 *           type: string
 *           example: "Id1"
 *         clientId:
 *           type: string
 *           format: uuid
 *           example: "mongoId"
 *         projectId:
 *           type: string
 *           format: uuid
 *           example: "mongoId"
 *         description:
 *           type: string
 *           example: "Descripcion de Albaran"
 *         hours:
 *           type: number
 *           example: 8
 *         format:
 *           type: string
 *           enum: [hours, materials]
 *         multi:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Pedro"
 *               hours:
 *                 type: number
 *                 exmample: 8
 *               description:
 *                 type: string
 *                 example: "descripcion"
 *         materials:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "descripcion"
 *               quantity:
 *                 type: number
 *                 example: 2

 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string

 */

module.exports=routerAlbaran

