import { UserService } from './user.services';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<import("./user.entity").User[]>;
    getUser(id: number): Promise<import("./user.entity").User>;
}
