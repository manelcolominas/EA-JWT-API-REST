import { Request, Response } from 'express';
import userService from '../services/user.service';
import logger from '../library/logger';

const createUser = async (req: Request, res: Response)  => {
    logger.info('Creating user');
    try {
        const createdUser = await userService.createUser(req.body);
        return res.status(201).json(createdUser);
    } 
    catch (error: any) {
        if (error.message === 'Email already in use') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

const readUser = async (req: Request, res: Response) => {
    logger.info('Getting user');
    const user = await userService.getUser(req.params.userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
}

const readAll = async (req: Request, res: Response) => {
    logger.info('Getting all users');
    const users = await userService.getAllUsers();
    return res.json(users);
}

const updateUser = async (req: Request, res: Response) => {
    logger.info('Updating user');
    const updated = await userService.updateUser(req.params.userId, req.body);
    if (!updated) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.json(updated);
}

const deleteUser = async (req: Request, res: Response) => {
    logger.info('Deleting user');
    const deleted = await userService.deleteUser(req.params.userId);
    if (!deleted) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.json(deleted);
}

export default { createUser, readUser, readAll, updateUser, deleteUser };
