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
        (req as any).organization = decoded.organization;
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
    } 
    catch (error) {
        return res.status(500).json({ message: error });
    }
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        const role = (req as any).userRole;
        if (role !== 'admin')
            return res.status(403).json({ message: 'Admin access required' });
        next();
    }
    catch (error) {
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
    } 
    catch (error) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }
}

export function requireRole(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const role = (req as any).userRole;
        if (!role || !roles.includes(role)) {
            return res.status(403).json({ message: `Access denied. Required role: ${roles.join(' or ')}` });
        }
        next();
    };
}

export function isOwnerOrAdminOrg(req: Request, res: Response, next: NextFunction) {
    const userIdFromToken = (req as any).userId;
    const userRole = (req as any).userRole;
    const userOrg = (req as any).organization; // organization from token
    const userIdParam = req.params.userId;
    const orgIdParam = req.params.organizationId; // if route includes orgId

    if (userIdFromToken === userIdParam) {
        return next();
    }

    if (userRole === 'admin' && userOrg && orgIdParam && String(userOrg) === String(orgIdParam)) {
        return next();
    }

    return res.status(403).json({ message: "Forbidden: not owner or org admin" });
}

export function isOrgMember(req: Request, res: Response, next: NextFunction) {
    const userRole = (req as any).userRole;
    const userOrg = (req as any).organization;
    const orgId = req.params.organizationId;

    if (userRole === 'admin') {
        return next();
    }

    if (userOrg && String(userOrg) === String(orgId)) {
        return next();
    }

    return res.status(403).json({
        message: 'Forbidden: not a member of this organization'
    });
}

export function isOrgAdmin(req: Request, res: Response, next: NextFunction) {
    const userRole = (req as any).userRole;
    const userOrg = (req as any).organization;
    const orgId = req.params.organizationId;

    if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Admin role required' });
    }

    if (!userOrg || String(userOrg) !== String(orgId)) {
        return res.status(403).json({
            message: 'Forbidden: admin from another organization'
        });
    }
    next();
}