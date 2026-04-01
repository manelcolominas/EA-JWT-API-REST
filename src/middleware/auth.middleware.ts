import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IJwtPayload } from '../models/JWTPayload';
import { config } from '../config/config';

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token)
        return res.status(403).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, config.jwt.accessSecret) as IJwtPayload;

        if (decoded.type !== 'access')
            return res.status(401).json({ message: "Invalid token type - Access token required" });

        (req as any).userId = decoded.id;
        (req as any).userRole = decoded.role;
        res.locals.UserId = decoded.id;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export async function isOwner(req: Request, res: Response, next: NextFunction) {
    try {
        const userIdRequest = (req as any).userId;
        const userId = req.params.userId;

        if (userId !== userIdRequest)
            return res.status(403).json({ message: "Not Owner" });

        next();
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}

export async function verifyRefreshToken(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies?.[config.cookies.refreshName];

    if (!refreshToken)
        return res.status(403).json({ message: "No refresh token provided" });

    try {
        const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as IJwtPayload;

        if (decoded.type !== 'refresh')
            return res.status(401).json({ message: "Invalid token type - Refresh token required" });

        (req as any).userId = decoded.id;
        (req as any).userRole = decoded.role;
        res.locals.UserId = decoded.id;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }
}

/**
 * Middleware factory — restricts a route to users with one of the allowed roles.
 * Always place AFTER verifyToken, which sets req.userRole.
 *
 * Usage:  router.delete('/:id', [verifyToken, requireRole('admin')], controller.delete)
 */
export function requireRole(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const role = (req as any).userRole;
        if (!role || !roles.includes(role)) {
            return res.status(403).json({ message: `Access denied. Required role: ${roles.join(' or ')}` });
        }
        next();
    };
}