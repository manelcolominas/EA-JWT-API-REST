import { Router } from 'express';
import controller from '../controllers/task.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { ValidateJoi, Schemas } from '../middleware/joi.middleware';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Tasks
 *     description: CRUD endpoints for tasks
 */

/**
 * @openapi
 * /tasks:
 *   post:
 *     summary: Creates a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - state
 *               - startDate
 *               - endDate
 *               - description
 *               - organizationId
 *             properties:
 *               title:
 *                 type: string
 *               state:
 *                 type: string
 *                 enum: ["TO DO", "IN PROGRESS", "DONE"]
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *               organizationId:
 *                 type: string
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 */
router.post('/', [verifyToken], ValidateJoi(Schemas.task.create), controller.createTask);

/**
 * @openapi
 * /tasks:
 *   get:
 *     summary: Lists all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', [verifyToken], controller.readAll);

/**
 * @openapi
 * /tasks/{taskId}:
 *   get:
 *     summary: Gets a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
router.get('/:taskId', [verifyToken], controller.readTask);

/**
 * @openapi
 * /tasks/{taskId}:
 *   put:
 *     summary: Updates a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               state:
 *                 type: string
 *                 enum: ["TO DO", "IN PROGRESS", "DONE"]
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 */
router.put('/:taskId', [verifyToken], ValidateJoi(Schemas.task.update), controller.updateTask);

/**
 * @openapi
 * /tasks/{taskId}/state:
 *   patch:
 *     summary: Updates only the state of a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - state
 *             properties:
 *               state:
 *                 type: string
 *                 enum: ["TO DO", "IN PROGRESS", "DONE"]
 */
router.patch('/:taskId/state', [verifyToken], ValidateJoi(Schemas.task.update), controller.updateTask);

/**
 * @openapi
 * /tasks/{taskId}:
 *   delete:
 *     summary: Deletes a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.delete('/:taskId', [verifyToken], controller.deleteTask);

export default router;