import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { UserModel } from '../models/user.model';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

export const validateUserCredentials = async (email: string, password: string) => {
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    if (user.password !== password) return null;

    return user;
};

export const getTokens = (user: any) => {
    const accessToken = generateAccessToken(
        String(user._id),
        user.name,
        user.email,
        user.organization as mongoose.Types.ObjectId
    );
    const refreshToken = generateRefreshToken(
        String(user._id),
        user.name,
        user.email,
        user.organization as mongoose.Types.ObjectId
    );

    return { accessToken, refreshToken };
};

export const refreshUserSession = async (incomingRefreshToken: string) => {
    const payload = verifyRefreshToken(incomingRefreshToken);
    const user = await UserModel.findById(payload.id);
    
    if (!user) throw new Error('User not found');

    const tokens = getTokens(user);
    return tokens;
};
