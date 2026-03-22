import { Request, Response, NextFunction } from 'express'
import jwt from "jsonwebtoken";

import { IUser } from '../models/user.model';
import { IJwtPayload } from '../models/JWTPayload';
import { logger } from '../config';

const _SECRET: string = 'api+jwt';
const _REFRESH_SECRET: string = 'refresh+jwt';

export async function verifyToken (req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    
    if (!token) 
      return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, _SECRET) as IJwtPayload;

    if (decoded.type !== 'access') {
      return res.status(401).json({ message: "Invalid token type - Access token required" });
    }

    // Alternativas para pasar el id del usuario a la siguiente función
    // 1. Modificando el Type Request de Express
    (req as Request).userId = decoded.id;
    // 2. Usando res.locals
    res.locals.UserId = decoded.id;

    
    /* 
    Aqui revisamos que el usuario esté en la base de datos

    if (!user) 
      return res.status(404).json({ message: "No user found" });
    */    
    next();

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

export async function isOwner (req: Request, res: Response, next: NextFunction) {
  try {

    // Cogemos el id del usuario del middleware anterior
    const userIdRequest = (req as any).userId;
    const userIdResponseLocals = res.locals.UserId;
    
    const username = req.params.id;
    if (username != userIdRequest) 
      return res.status(403).json({ message: "Not Owner" });

    next();

  } catch (error) {
    logger.error(error)
    return res.status(500).send({ message: error });
  }
};

export async function verifyRefreshToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    
    if (!refreshToken) 
        return res.status(403).json({ message: "No refresh token provided" });
    
    try {
        const decoded = jwt.verify(refreshToken, _REFRESH_SECRET) as IJwtPayload;
        if (decoded.type !== 'refresh') {
            return res.status(401).json({ message: "Invalid token type - Refresh token required" });
        }
        
        (req as any).userId = decoded.id;
        res.locals.UserId = decoded.id;
        
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid refresh token!" });
    }
}

