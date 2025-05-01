const express=require('express')

const {crearUsuario,modificarUsuarioRegister,loginUsuario,modificarUsuario, getUser, uploadImage,deleteUser,recoverPassword, comprobarUsuarioVerificado,cambiarPassword, AllUsers}=require('../controllers/users.js')
const {validatorRegister,validatorVerification, validatorLogin,validatorRegisterPut, validatorCompany, validatorLogo, addressValidator,inviteValidator, validatorRecover}=require("../validators/userValidator.js")
const verificationMiddleware = require('../middleware/verificationMiddleware.js')
const { uploadMiddlewareMemory } = require('../utils/handlestorage.js')
const authMiddleware = require('../middleware/authMiddleware.js')


const routerUsers=express.Router()
routerUsers.use(express.json())

routerUsers.get('/allUsers',AllUsers)

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *     - User
 *     summary: "Get user"
 *     description: Get a user
 *     responses:
 *       '200':
 *         description: Returns the user data
 *       '401':
 *         description: Unauthorized - invalid or missing token
 *       '403':
 *         description: Token is expired
 *       '500':
 *         description: User not verified or error
 *     security:
 *       - bearerAuth: []
 */
routerUsers.get('/', authMiddleware, getUser)

/**
 * @openapi
 * /api/users/verify:
 *   get:
 *     tags:
 *     - User
 *     summary: "Check if user is verified"
 *     description: Checks if user is verified and logs the code
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User verified, code sent
 *       '401':
 *         description: Unauthorized - invalid or missing token
 *       '403':
 *         description: Token is expired
 *       '500':
 *         description: User not verified or error
 */
routerUsers.get('/verify', comprobarUsuarioVerificado)

/**
 * @openapi
 * /api/users/register:
 *   post:
 *     tags:
 *     - User
 *     summary: "User register"
 *     description: Register a new user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/user"
 *     responses:
 *       '200':
 *         description: Returns the inserted object
 *       '401':
 *         description: Unauthorized - invalid or missing token
 *       '403':
 *         description: Token is expired
 *       '500':
 *         description: User not verified or error
 *     security:
 *       - bearerAuth: []
 */
routerUsers.post('/register', validatorRegister, crearUsuario)

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     tags:
 *     - User
 *     summary: "Login user"
 *     description: Login with email and password
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/user"
 *     responses:
 *       '200':
 *         description: Returns user data and JWT token
 *       '401':
 *         description: Unauthorized - invalid or missing token
 *       '403':
 *         description: Token is expired or wrong password, Missing required fields
 *       '404':
 *         description: User not found 
 *       '500':
 *         description: User not verified or error
 */
routerUsers.post('/login', validatorLogin, loginUsuario)

/**
 * @openapi
 * /api/users/validation:
 *   post:
 *     tags:
 *     - User
 *     summary: "Recover account"
 *     description: Initiates account recovery by sending a token
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/verification"
 *     responses:
 *       '200':
 *         description: Recovery token sent
 *       '401':
 *         description: Unauthorized - invalid or missing token
 *       '403':
 *         description: Token is expired
 *       '500':
 *         description: User not verified or error
 */
routerUsers.post('/validation', validatorRecover, recoverPassword)

/**
 * @openapi
 * /api/users/invite:
 *   post:
 *     tags:
 *     - User
 *     summary: "Invite a user"
 *     description: Invite another user to the platform
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/invite"
 *     responses:
 *       '200':
 *         description: User invited successfully
 *       '409':
 *         description: User already exists
 *       '404':
 *         description: company not found
 *       '401':
 *         description: Unauthorized - invalid or missing token
 *       '403':
 *         description: Token is expired, Missing required fields 
 *       '500':
 *         description: User not verified or error
 */
routerUsers.post('/invite', inviteValidator, crearUsuario)

/**
 * @openapi
 * /api/users/company:
 *   patch:
 *     tags:
 *     - User
 *     summary: "Add or update company info"
 *     description: Only for users marked as autonomo
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/company"
 *     responses:
 *       '200':
 *         description: Company data updated 
 *       '401':
 *         description: Unauthorized - invalid or missing token
 *       '403':
 *         description: Token is expired, Missing required fields
 *       '500':
 *         description: User not verified or error
 *     security:
 *       - bearerAuth: []
 */
routerUsers.patch('/company', validatorCompany, authMiddleware, modificarUsuario)

/**
 * @openapi
 * /api/users/logo:
 *   patch:
 *     tags:
 *     - User
 *     summary: "Upload profile/company logo"
 *     description: Uploads image to IPFS and links it to the user
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Image uploaded and user updated
 *       '400':
 *         description: File too large or invalid
 *       '401':
 *         description: Unauthorized - invalid or missing token
 *       '403':
 *         description: Token is expired
 *       '500':
 *         description: User not verified or error
 *     security:
 *       - bearerAuth: []
 */
routerUsers.patch(
  '/logo',
  uploadMiddlewareMemory.single("image"),
  (err, req, res, next) => {
    if (err.code == "LIMIT_FILE_SIZE") {
      res.status(400).send("El archivo es demasiado grande")
    }
  },
  uploadImage,
  authMiddleware,
  modificarUsuario
)

/**
 * @openapi
 * /api/users/cambiarPassword:
 *   patch:
 *     tags:
 *     - User
 *     summary: "Change password"
 *     description: Change user password by providing email and new password
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/user"
 *     responses:
 *       '200':
 *         description: Password updated 
 *       '401':
 *         description: Unauthorized - invalid or missing token
 *       '403':
 *         description: Token is expired, Body validation error
 *       '500':
 *         description: User not verified or error
 */
routerUsers.patch('/cambiarPassword', validatorLogin, cambiarPassword)

/**
 * @openapi
 * /api/users/address:
 *   patch:
 *     tags:
 *     - User
 *     summary: "Update address"
 *     description: Updates user's address information
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/address"
 *     responses:
 *       '200':
 *         description: Address updated
 *       '401':
 *         description: Unauthorized - invalid or missing token
 *       '403':
 *         description: Token is expired,Invalid address info
 *       '500':
 *         description: User not verified or error
 *     security:
 *       - bearerAuth: []
 */
routerUsers.patch('/address', addressValidator, authMiddleware, modificarUsuario)

/**
 * @openapi
 * /api/users/validation:
 *   put:
 *     tags:
 *     - User
 *     summary: "Verify user account"
 *     description: Activates user after code validation
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/verificationPut"
 *     responses:
 *       '200':
 *         description: User successfully verified
 *       '401':
 *         description: Unauthorized - invalid or missing token
 *       '403':
 *         description: Token is expired
 *       '500':
 *         description: User not verified or error
 *     security:
 *       - bearerAuth: []
 */
routerUsers.put('/validation', validatorVerification, verificationMiddleware, modificarUsuarioRegister)

/**
 * @openapi
 * /api/users/register:
 *   put:
 *     tags:
 *     - User
 *     summary: "Update user registration data"
 *     description: Updates user data like address or company after registration
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/putRegister"
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '401':
 *         description: Unauthorized - invalid or missing token
 *       '403':
 *         description: Token is expired
 *       '500':
 *         description: User not verified or error
 *     security:
 *       - bearerAuth: []
 */
routerUsers.put('/register', validatorRegisterPut, authMiddleware, modificarUsuario)

/**
* @openapi
 * /api/users/:
 *   delete:
 *     tags:
 *     - User
 *     summary: "Delete user"
 *     description: Deletes a user account (soft delete by default, hard if `soft=false`)
 *     parameters:
 *       - in: query
 *         name: soft
 *         required: false
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: "Use 'false' for hard delete. Default is soft delete."
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '401':
 *         description: Unauthorized - invalid or missing token
 *       '403':
 *         description: Token is expired
 *       '500':
 *         description: User not verified or error
 *     security:
 *       - bearerAuth: []
 */
routerUsers.delete('/', authMiddleware, deleteUser)

module.exports=routerUsers