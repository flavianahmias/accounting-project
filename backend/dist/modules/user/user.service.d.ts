import { Repository } from 'typeorm';
import { Role, User } from './user.entity';
export interface UserFromTransaction {
    username: string;
    role: Role;
    creatorName?: string;
    balance?: number;
}
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    getUser(): string;
    getUserById(id: number): Promise<User>;
    createUsers(usersFromTransaction: UserFromTransaction[]): Promise<import("typeorm").InsertResult>;
    changeBalanceToUser(id: number, amount: number): Promise<User>;
}
