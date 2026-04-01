import mongoose, { Document, model, Schema, Types } from 'mongoose';
import { IUser } from './user.model';

export interface IOrganization {
    _id: Types.ObjectId;
    name: string;
    users: Types.ObjectId[];
}

const OrganizationSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    },
    {
        versionKey: false
    }
);

export const OrganizationModel = model<IOrganization>('Organization', OrganizationSchema);
