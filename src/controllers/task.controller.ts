import { Request, Response } from 'express';
import taskService from '../services/task.service';
import logger from '../library/logger';

const createTask = async (req: Request, res: Response) => {
    logger.info('Creating task');
    try {
        const createdTask = await taskService.createTask(req.body);
        return res.status(201).json(createdTask);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

const readTask = async (req: Request, res: Response) => {
    logger.info('Getting task');
    const task = await taskService.getTask(req.params.taskId);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    return res.json(task);
};

const readAll = async (req: Request, res: Response) => {
    logger.info('Getting all tasks');
    const tasks = await taskService.getAllTasks();
    return res.json(tasks);
};

const updateTask = async (req: Request, res: Response) => {
    logger.info('Updating task');
    const updated = await taskService.updateTask(req.params.taskId, req.body);
    if (!updated) {
        return res.status(404).json({ message: 'Task not found' });
    }
    return res.json(updated);
};

const deleteTask = async (req: Request, res: Response) => {
    logger.info('Deleting task');
    const deleted = await taskService.deleteTask(req.params.taskId);
    if (!deleted) {
        return res.status(404).json({ message: 'Task not found' });
    }
    return res.json(deleted);
};

export default { createTask, readTask, readAll, updateTask, deleteTask };