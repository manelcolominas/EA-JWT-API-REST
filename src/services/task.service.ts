import { TaskModel, ITask } from '../models/task.model';

const createTask = async (data: Partial<ITask>): Promise<ITask> => {
    const task = new TaskModel(data);
    return await task.save();
};

const getTask = async (taskId: string): Promise<ITask | null> => {
    return await TaskModel.findById(taskId).populate('organizationId', 'name').populate('users', 'name email');
};

const getAllTasks = async (): Promise<ITask[]> => {
    return await TaskModel.find().populate('organizationId', 'name').populate('users', 'name email');
};

const updateTask = async (taskId: string, data: Partial<ITask>): Promise<ITask | null> => {
    return await TaskModel.findByIdAndUpdate(taskId, data, { new: true });
};

const deleteTask = async (taskId: string): Promise<ITask | null> => {
    return await TaskModel.findByIdAndDelete(taskId);
};

const getTasksByOrganization = async (organizationId: string): Promise<ITask[]> => {
    return await TaskModel.find({ organizationId }).populate('users', 'name email');
};

export default { createTask, getTask, getAllTasks, updateTask, deleteTask, getTasksByOrganization };