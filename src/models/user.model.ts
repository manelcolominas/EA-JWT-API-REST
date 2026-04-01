import mongoose, { model, Schema, Types } from 'mongoose';

export type UserRole = 'user' | 'admin';

export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    organization: mongoose.Types.ObjectId | string;
}

const UserSchema: Schema = new Schema(
    {
        name:         { type: String, required: true },
        email:        { type: String, required: true, unique: true },
        password:     { type: String, required: true },
        role:         { type: String, enum: ['user', 'admin'], default: 'user' },
        organization: { type: Schema.Types.ObjectId, required: true, ref: 'Organization' }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const UserModel = model<IUser>('User', UserSchema);