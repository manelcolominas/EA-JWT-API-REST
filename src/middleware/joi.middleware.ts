import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import { IOrganization } from '../models/organization.model';
import { IUser } from '../models/user.model';
import { ITask } from '../models/task.model';

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

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
            organization: objectId.optional()
        }),
        update: Joi.object<IUser>({
            name: Joi.string().optional(),
            email: Joi.string().email().optional(),
            password: Joi.string().min(6).optional(),
            role: Joi.string().valid('user', 'admin').optional(),
            organization: objectId.optional()
        })
    },

    task: {
        create: Joi.object<ITask>({
            title: Joi.string().required(),
            startDate: Joi.date().required(),
            endDate: Joi.date(),
            state: Joi.string().valid("TO DO", "IN PROGRESS", "DONE").required(),
            description: Joi.string().required(),
            organizationId: objectId.required(),
            users: Joi.array().items(objectId).optional()
        }),
        update: Joi.object<ITask>({
            title: Joi.string().optional(),
            startDate: Joi.date().optional(),
            endDate: Joi.date().optional(),
            state: Joi.string().valid("TO DO", "IN PROGRESS", "DONE").optional(),
            description: Joi.string().optional(),
            organizationId: objectId.optional(),
            users: Joi.array().items(objectId).optional()
        }),
        updateState: Joi.object<Pick<ITask, 'state'>>({
            state: Joi.string().valid("TO DO", "IN PROGRESS", "DONE").required()
        })
    }
};