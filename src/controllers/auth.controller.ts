import { Request, Response } from 'express'
import jwt from "jsonwebtoken";
import { userService } from '../services/user.service';
import { IJwtPayload } from '../models/JWTPayload';
import { IUser } from '../models/user.model';

const _SECRET: string = 'api+jwt';
const _REFRESH_SECRET: string = 'refresh+jwt';

function generateAccessToken(username: string): string {
    const session = { id: username, type: 'access' } as IJwtPayload;
    return jwt.sign(session, _SECRET, {
        expiresIn: '15m', // access token dura 15 minutos
    });
}

function generateRefreshToken(username: string): string {
    const session = { id: username, type: 'refresh' } as IJwtPayload;
    return jwt.sign(session, _REFRESH_SECRET, {
        expiresIn: '7d', // refresh token dura 7 días
    });
}

export async function signup(req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user already exists
    const existingUser = await userService.findOne(username);
    if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
    }

    // Create new user
    const newUser = { username, password } as IUser;
    const createdUser = await userService.create(newUser);

    // Generate tokens
    const accessToken = generateAccessToken(username);
    const refreshToken = generateRefreshToken(username);

    return res.status(201).json({
        user: createdUser,
        accessToken,
        refreshToken
    });
}

export async function signin(req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await userService.findOne(username);
    
    if (!user) {
        return res.status(400).json({ message: "User Not Found" });
    }

    if (user.password !== password) {
        return res.status(401).json({ message: "Invalid Password" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(username);
    const refreshToken = generateRefreshToken(username);
    
    return res.json({
        accessToken,
        refreshToken
    });
}

export async function refresh(req: Request, res: Response): Promise<Response> {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not provided" });
    }

    try {
        const decoded = jwt.verify(refreshToken, _REFRESH_SECRET) as IJwtPayload;
        
        if (decoded.type !== 'refresh') {
            return res.status(401).json({ message: "Invalid token type" });
        }

        // Verify user exists
        const user = await userService.findOne(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate new access token
        const accessToken = generateAccessToken(decoded.id);
        
        return res.json({ accessToken });
    } catch (error) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }
}