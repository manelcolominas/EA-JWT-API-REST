import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config';
import userService from '../services/user.service';
import * as authService from '../services/auth';
import {UserModel} from '../models/user.model';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { AuthRequest } from '../models/AuthRequest';


export const signup = async (req: Request, res: Response) => {
    const { name, email, password, organization } = req.body;

    if (!name || !email || !password || !organization) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newUser = await userService.createUser({ name, email, password, organization });

        const accessToken = generateAccessToken(String(newUser._id), newUser.name, newUser.email, newUser.organization );
        const refreshToken = generateRefreshToken(String(newUser._id), newUser.name, newUser.email, newUser.organization );

        res.cookie(config.cookies.refreshName, refreshToken, config.cookies.options);

        return res.status(201).json({ user: newUser, accessToken });
    } catch (error: any) {
        if (error.message === 'Email already in use') {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
        const user = await authService.validateUserCredentials(email, password);
        
        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const { accessToken, refreshToken } = authService.getTokens(user);

        res.cookie(config.cookies.refreshName, refreshToken, config.cookies.options);

        return res.status(200).json({
            message: 'Succesfull login',
            accessToken,
            usuario: {
                _id: user._id,
                name: user.name,
                email: user.email,
                organization: user.organization
            }
        });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export const refresh = async (req: Request, res: Response) => {
    // userId is already verified and set by verifyRefreshToken middleware
    const userId = (req as any).userId;

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const accessToken = generateAccessToken(
            String(user._id),
            user.name,
            user.email,
            user.organization
        );
        return res.json({ accessToken });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie(config.cookies.refreshName, {
            ...config.cookies.options
        });

        return res.status(200).json({ message: 'Succesfull logout' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await UserModel.findById(req.userId).populate('organization');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error });
    }
};