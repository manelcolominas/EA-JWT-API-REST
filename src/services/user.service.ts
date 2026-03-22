import { IUser } from '../models/user.model';

class UserService {
    private users: IUser[] = [
        { username: "user1", password: 'password1' },
        { username: "user2", password: 'password2' },
        { username: "user3", password: 'password3' }
    ];

    async findAll(): Promise<IUser[]> {
        return this.users;
    }

    async findOne(username: string): Promise<IUser | undefined> {
        return this.users.find(user => user.username === username);
    }

    async create(user: IUser): Promise<IUser> {
        this.users.push(user);
        return user;
    }

    async update(username: string, updatedUser: IUser): Promise<IUser | undefined> {
        const index = this.users.findIndex(user => user.username === username);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...updatedUser };
            return this.users[index];
        }
        return undefined;
    }

    async delete(username: string): Promise<IUser | undefined> {
        const index = this.users.findIndex(user => user.username === username);
        if (index !== -1) {
            const deletedUser = this.users[index];
            this.users.splice(index, 1);
            return deletedUser;
        }
        return undefined;
    }
}

export const userService = new UserService();