import { UserService } from './user.service';
export declare class AppController {
    private readonly userService;
    constructor(userService: UserService);
    getUser(): string;
}
