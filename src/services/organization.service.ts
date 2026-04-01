import mongoose from 'mongoose';
import { OrganizationModel, IOrganization } from '../models/organization.model';
import { UserModel } from '../models/user.model';


const createOrganization = (data: Partial<IOrganization>): Promise<IOrganization> => {
    const organization = new OrganizationModel({
        _id: new mongoose.Types.ObjectId(),
        users: [],
        ...data
    });
    return organization.save();
};

const getOrganization = async (organizationId: string): Promise<IOrganization | null> => {
    return await OrganizationModel.findById(organizationId);
};

const getAllOrganizations = async (): Promise<IOrganization[]> => {
    return await OrganizationModel.find();
};

const updateOrganization = async (organizationId: string, data: Partial<IOrganization>): Promise<IOrganization | null> => {
    const organization = await OrganizationModel.findById(organizationId);
    if (organization) {
        organization.set(data);
        return organization.save();
    }
    return null;
};

const deleteOrganization = async (organizationId: string): Promise<IOrganization | null> => {
    // Check if organization has users
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) return null;
    
    const userCount = await UserModel.countDocuments({ organization: organizationId });
    
    if (userCount > 0) {
        throw new Error(`Cannot delete organization with ${userCount} users. Reassign or delete users first.`);
    }
    
    return await OrganizationModel.findByIdAndDelete(organizationId);
};

const getOrganizationWithUsers = async (organizationId: string): Promise<IOrganization | null> => {
    return await OrganizationModel.findById(organizationId).populate('users', '-organization -password -createdAt -updatedAt').lean();
};

const removeUserFromOrganization = async (organizationId: string, userId: string): Promise<IOrganization | null> => {
    const organization = await OrganizationModel.findById(organizationId);
    if (!organization) return null;

    const isMember = organization.users.some((id) => id.toString() === userId);
    if (!isMember) throw new Error('USER_NOT_IN_ORG');

    return await OrganizationModel.findByIdAndUpdate(
        organizationId,
        { $pull: { users: userId } },
        { new: true }
    );
};

export default { createOrganization, getOrganization, getAllOrganizations, updateOrganization, deleteOrganization, getOrganizationWithUsers, removeUserFromOrganization };
