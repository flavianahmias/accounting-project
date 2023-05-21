import { UserService } from './user.services';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUser(id: number): Promise<import("./user.entity").User>;
}
