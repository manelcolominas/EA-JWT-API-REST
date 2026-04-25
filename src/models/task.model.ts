import mongoose, {Document, model, Schema, Types} from 'mongoose';
import {IOrganization} from "./organization.model";

export interface ITask {
    title: string;
    state: "TO DO" | "IN PROGRESS" | "DONE";
    startDate: Date;
    endDate: Date;
    description: string;
    organizationId: Types.ObjectId | string;
    users: Types.ObjectId[] | string[];
}

const TaskSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        state: { type: String, required: true, enum: ["TO DO", "IN PROGRESS", "DONE"] },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        description: { type: String, required: true },
        organizationId: { type: Schema.Types.ObjectId, required: true, ref: 'Organization' },
        users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    },
    {
        versionKey: false
    }
);

export const TaskModel = model<ITask>('Task', TaskSchema);
