import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Import all models
import { OrganizationModel } from '../models/organization.model';
import { UserModel } from '../models/user.model';
import { TaskModel } from '../models/task.model';


const modelMap: { [key: string]: mongoose.Model<any> } = {
    'organizations.json': OrganizationModel,
    'users.json': UserModel,
    'tasks.json': TaskModel
};

export const insertData = async () => {
    try {
        // Try multiple locations for the data directory
        const possiblePaths = [
            path.join(__dirname, '../data'),           // build/data
            path.join(process.cwd(), 'src/data'),      // src/data (from root)
            path.join(__dirname, '../../src/data')     // src/data (relative to build/utils)
        ];

        let dataDir = '';
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                dataDir = p;
                break;
            }
        }

        if (!dataDir) {
            return;
        }

        const files = fs.readdirSync(dataDir);
        // Delete all data from collections
        for (const file of files) {
            if (file.endsWith('.json')) {
                const model = modelMap[file];
                if (model) {
                    await model.deleteMany({});
                }
            }
        }
        for (const file of files) {
            if (file.endsWith('.json')) {
                const model = modelMap[file];
                if (model) {
                    const filePath = path.join(dataDir, file);
                    const fileContent = fs.readFileSync(filePath, 'utf-8');
                    const data = JSON.parse(fileContent);
                    await model.insertMany(data);
                }
            }
        }
    }
    catch (error) {
    }
};
