import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import { IOrganization } from '../models/organization.model';
import { IUser } from '../models/user.model';

export const ValidateJoi = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);
            next();
        } catch (error) {
            return res.status(422).json({ error });
        }
    };
};

export const Schemas = {
    organization: {
        create: Joi.object<IOrganization>({
            name: Joi.string().required()
        }),
        update: Joi.object<IOrganization>({
            name: Joi.string().required()
        })
    },
    user: {
        create: Joi.object<IUser>({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            role: Joi.string().valid('user', 'admin').required(),
            organization: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }),
        update: Joi.object<IUser>({
            name: Joi.string().optional(),
            email: Joi.string().email().optional(),
            password: Joi.string().min(6).optional(),
            organization: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional()
        })
    }
};