import { NextFunction, Request, Response } from 'express';
import OrganizationService from '../services/organization.service';

const createOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const savedOrganization = await OrganizationService.createOrganization(req.body);
        return res.status(201).json(savedOrganization);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organization = await OrganizationService.getOrganization(req.params.organizationId);
        return organization ? res.status(200).json(organization) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organizations = await OrganizationService.getAllOrganizations();
        return res.status(200).json(organizations);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const updateOrganization = async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.params.organizationId;

    try {
        const organization = await OrganizationService.updateOrganization(organizationId, req.body);
        return organization ? res.status(200).json(organization) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

// organization.controller.ts
const deleteOrganization = async (req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.params.organizationId;

    try {
        const organization = await OrganizationService.deleteOrganization(organizationId);
        return organization ? res.status(200).json(organization) : res.status(404).json({ message: 'not found' });
    } 
    catch (error: any) {
        if (error.message.includes('Cannot delete organization')) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ error });
    }
};

const getOrganizationWithUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organization = await OrganizationService.getOrganizationWithUsers(req.params.organizationId);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        return res.status(200).json(organization);
    }
    catch (error) {
        return res.status(500).json({ error });
    }
};

const removeUserFromOrganization = async (req: Request, res: Response, next: NextFunction) => {
    const { organizationId, userId } = req.params;

    try {
        const organization = await OrganizationService.removeUserFromOrganization(organizationId, userId);
        return organization ? res.status(200).json(organization) : res.status(404).json({ message: 'Organization not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export default { createOrganization, readOrganization, readAll, updateOrganization, deleteOrganization, getOrganizationWithUsers, removeUserFromOrganization };