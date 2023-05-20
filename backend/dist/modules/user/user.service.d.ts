import { Repository } from 'typeorm';
import { Role, User } from './user.entity';
export interface UserFromTransaction {
    username: string;
    role: Role;
    creatorName?: string;
}
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    getUser(): string;
    createUsers(usersFromTransaction: UserFromTransaction[]): Promise<import("typeorm").InsertResult>;
}
