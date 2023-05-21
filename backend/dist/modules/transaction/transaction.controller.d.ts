/// <reference types="multer" />
import { TransactionService } from './transaction.services';
import { UserService } from '../user/user.services';
export declare class TransactionController {
    private readonly transactionService;
    private readonly userService;
    constructor(transactionService: TransactionService, userService: UserService);
    findAll(): Promise<import("./transaction.entity").Transaction[]>;
    createFromFile(file: Express.Multer.File): Promise<void>;
    getTransaction(id: number): Promise<import("./transaction.entity").Transaction>;
}
