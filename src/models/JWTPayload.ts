// https://nozzlegear.com/blog/implementing-a-jwt-auth-system-with-typescript-and-node

export interface IJwtPayload {
    id: string;
    type: 'access' | 'refresh';
}