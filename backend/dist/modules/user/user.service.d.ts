import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    getUser(): string;
    createUsers(usernames: string[]): Promise<import("typeorm").InsertResult>;
}
