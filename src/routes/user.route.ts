import { Router } from 'express';
import controller from '../controllers/user.controller';
import { verifyToken, isOwner, requireRole, isOwnerOrAdminOrg } from '../middleware/auth.middleware';
import { ValidateJoi, Schemas } from '../middleware/joi.middleware';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: CRUD endpoints for users
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "65f1c2a1b2c3d4e5f6789012"
 *         name:
 *           type: string
 *           example: "Alice"
 *         email:
 *           type: string
 *           example: "alice@example.com"
 *         organization:
 *           type: string
 *           example: "65f1c2a1b2c3d4e5f6789013"
 *     UserCreateUpdate:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - organization
 *       properties:
 *         name:
 *           type: string
 *           example: "Alice"
 *         email:
 *           type: string
 *           example: "alice@example.com"
 *         password:
 *           type: string
 *           example: "password123"
 *         organization:
 *           type: string
 *           example: "65f1c2a1b2c3d4e5f6789013"
 */

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Creates a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateUpdate'
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Email already in use
 *       422:
 *         description: Validation failed
 */
router.post('/', [verifyToken, requireRole('admin')], ValidateJoi(Schemas.user.create), controller.createUser );

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Lists all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', [verifyToken, requireRole('admin')], controller.readAll);

/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     summary: Gets a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
router.get('/:userId', [verifyToken, isOwnerOrAdminOrg], controller.readUser);

/**
 * @openapi
 * /users/{userId}:
 *   put:
 *     summary: Updates a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateUpdate'
 *     responses:
 *       200:
 *         description: Updated
 *       403:
 *         description: Not owner
 *       404:
 *         description: Not found
 *       422:
 *         description: Validation failed
 */
router.put('/:userId', [verifyToken, isOwnerOrAdminOrg], ValidateJoi(Schemas.user.update),  controller.updateUser );

/**
 * @openapi
 * /users/{userId}:
 *   delete:
 *     summary: Deletes a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       403:
 *         description: Not owner
 *       404:
 *         description: Not found
 */
router.delete('/:userId', [verifyToken, isOwnerOrAdminOrg], controller.deleteUser );

export default router;