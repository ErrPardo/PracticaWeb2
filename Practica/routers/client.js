const express=require('express')

const {validateClient}=require('../validators/clientValidator')
const { crearClient,getClients,getOneClientById, deleteClient,restoreClient,modificarClient} = require('../controllers/clients')
const authMiddleware = require('../middleware/authMiddleware.js')

const routerClient=express.Router()
routerClient.use(express.json())

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Endpoints para gestión de clientes
 */

/**
 * @swagger
 * /api/client:
 *   get:
 *     summary: Obtener todos los clientes
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       500:
 *         description: Error interno del servidor
 */
routerClient.get('/', authMiddleware, getClients)

/**
 * @swagger
 * /api/client/{id}:
 *   get:
 *     summary: Obtener cliente por ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error interno del servidor
 */
routerClient.get('/:id', authMiddleware, getOneClientById)

/**
 * @swagger
 * /api/client/archive/{id}:
 *   delete:
 *     summary: Eliminar cliente (soft delete)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente archivado
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error interno del servidor
 */
routerClient.delete('/archive/:id', authMiddleware, deleteClient)

/**
 * @swagger
 * /api/client/{id}:
 *   delete:
 *     summary: Eliminar cliente (hard delete)
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente eliminado permanentemente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error interno del servidor
 */
routerClient.delete('/:id', authMiddleware, deleteClient)

/**
 * @swagger
 * /api/client:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       201:
 *         description: Cliente creado
 *       400:
 *         description: Error de validación o datos incorrectos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       409:
 *         description: Cliente ya existe
 *       500:
 *         description: Error interno del servidor
 */
routerClient.post('/', validateClient, authMiddleware, crearClient)

/**
 * @swagger
 * /api/client/{id}:
 *   put:
 *     summary: Modificar un cliente existente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *       400:
 *         description: Datos inválidos o malformados
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Cliente no encontrado
 *       409:
 *         description: Conflicto con datos existentes
 *       500:
 *         description: Error interno del servidor
 */
routerClient.put('/:id', validateClient, authMiddleware, modificarClient)

/**
 * @swagger
 * /api/client/restore/{id}:
 *   patch:
 *     summary: Restaurar un cliente archivado
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente restaurado
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error interno del servidor
 */
routerClient.patch('/restore/:id', authMiddleware, restoreClient)


/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "ASC"
 *         cif:
 *           type: string
 *           example: "D52921213"
 *         address:
 *           $ref: '#/components/schemas/address'
 *       required: [name, cif, address]
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

module.exports = routerClient





