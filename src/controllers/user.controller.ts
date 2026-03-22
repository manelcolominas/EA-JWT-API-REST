import { Request, Response } from 'express'
import { IUser } from '../models/user.model';
import { userService } from '../services/user.service';
import { logger } from '../config';

export async function createUser(req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body;
    logger.info('Creating user');

    const newUser = { username, password } as IUser;
    const createdUser = await userService.create(newUser);
    return res.json(createdUser);
}

export async function getUsers(req: Request, res: Response): Promise<Response> {
    logger.info('Getting users');

    const users = await userService.findAll();
    return res.json(users);
}

export async function getUser(req: Request, res: Response): Promise<Response> {
    logger.info('Getting user');

    const username = req.params.id;
    const user = await userService.findOne(username);
    
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    
    return res.json(user);
}

export async function deleteUser(req: Request, res: Response): Promise<Response> {
    logger.info('Deleting user');

    const username = req.params.id;
    const deletedUser = await userService.delete(username);
    
    if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
    }
    
    return res.json(deletedUser);
}

export async function updateUser(req: Request, res: Response): Promise<Response> {
    logger.info('Updating user');
    
    const username = req.params.id;
    const { password } = req.body;

    const updatedUser = await userService.update(username, { username, password } as IUser);
    
    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }
    
    return res.json(updatedUser);
}
