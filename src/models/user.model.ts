import mongoose, { Document, model, Schema, Types } from 'mongoose';

export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    organization: mongoose.Types.ObjectId | string;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        organization: { type: Schema.Types.ObjectId, required: true, ref: 'Organization' }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const UserModel = model<IUser>('User', UserSchema);
