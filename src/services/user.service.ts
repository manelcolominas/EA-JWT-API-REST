import mongoose from 'mongoose';
import { UserModel, IUser } from '../models/user.model';
import { OrganizationModel } from '../models/organization.model';

const createUser = async (data: Partial<IUser>): Promise<IUser> => {
    const user = new UserModel({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });
    const savedUser = await user.save();

    // Afegir l'usuari a l'organització
    await OrganizationModel.findByIdAndUpdate(
        savedUser.organization,
        { $addToSet: { users: savedUser._id } }
    );

    return savedUser;
};

const getUser = async (userId: string): Promise<IUser | null> => {
    const user = await UserModel.findById(userId).populate('organization', 'name');
    return user;
};

const getAllUsers = async (): Promise<IUser[]> => {
    const users = await UserModel.find().populate('organization', 'name');
    return users;
};

const updateUser = async (userId: string, data: Partial<IUser>): Promise<IUser | null> => {
    const user = await UserModel.findById(userId);
    if (user) {
        // Si l'organització canvia, actualitzar les llistes d'usuaris a les organitzacions
        if (data.organization && data.organization.toString() !== user.organization.toString()) {
            // Eliminar de l'antiga organització
            await OrganizationModel.findByIdAndUpdate(user.organization, {
                $pull: { users: user._id }
            });

            // Afegir a la nova organització
            await OrganizationModel.findByIdAndUpdate(data.organization, {
                $addToSet: { users: user._id }
            });
        }

        user.set(data);
        return await user.save();
    }
    return null;
};

// user.service.ts - update deleteUser function
const deleteUser = async (userId: string): Promise<IUser | null> => {
    const user = await UserModel.findById(userId);
    if (user) {
        // Remove user from organization's users array
        await OrganizationModel.findByIdAndUpdate(user.organization, {
            $pull: { users: user._id }
        });
    }
    return await UserModel.findByIdAndDelete(userId);
};

export default { createUser, getUser, getAllUsers, updateUser, deleteUser };
