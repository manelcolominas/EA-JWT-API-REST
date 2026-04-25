import express from 'express';
import controller from '../controllers/organization.controller';
import { verifyToken, isOwnerOrAdminOrg, isAdmin, isOrgMember, isOrgAdmin } from '../middleware/auth.middleware'; 
import { Schemas, ValidateJoi } from '../middleware/joi.middleware';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Organizations
 *     description: CRUD endpoints for organizations
 */

/**
 * @openapi
 * /organizations:
 *   post:
 *     summary: Creates an organization
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrganizationCreateUpdate'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', [verifyToken, isAdmin], ValidateJoi(Schemas.organization.create), controller.createOrganization);

/**
 * @openapi
 * /organizations/{organizationId}/tasks:
 *   get:
 *     summary: Gets all tasks for an organization
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:organizationId/tasks', [verifyToken, isOrgMember], controller.getTasksByOrganization);

/**
 * @openapi
 * /organizations/{organizationId}/full:
 *   get:
 *     summary: Gets a single organization with populated users
 *     security:
 *       - bearerAuth: [] 
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:organizationId/full', [verifyToken, isOrgMember], controller.getOrganizationWithUsers);

/**
 * @openapi
 * /organizations/{organizationId}:
 *   get:
 *     summary: Gets an organization by ID
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:organizationId', [verifyToken, isOrgMember], controller.readOrganization);

/**
 * @openapi
 * /organizations:
 *   get:
 *     summary: Lists all organizations
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', [verifyToken], controller.readAll);

/**
 * @openapi
 * /organizations/{organizationId}:
 *   put:
 *     summary: Updates an organization by ID
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.put('/:organizationId', [verifyToken, isOrgAdmin], ValidateJoi(Schemas.organization.update), controller.updateOrganization);

/**
 * @openapi
 * /organizations/{organizationId}:
 *   delete:
 *     summary: Deletes an organization by ID
 *     security:
 *       - bearerAuth: [] 
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.delete('/:organizationId', [verifyToken, isOrgAdmin] , controller.deleteOrganization);

/**
 * @openapi
 * /organizations/{organizationId}/users/{userId}:
 *   delete:
 *     summary: Removes a user from an organization
 *     security:
 *       - bearerAuth: [] 
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.delete('/:organizationId/users/:userId', [verifyToken, isOwnerOrAdminOrg] , controller.removeUserFromOrganization);

export default router;