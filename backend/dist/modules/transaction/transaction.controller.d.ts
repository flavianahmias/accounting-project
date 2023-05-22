/// <reference types="multer" />
import { TransactionService } from './transaction.services';
import { UserService } from '../user/user.services';
import { Response } from 'express';
export declare class TransactionController {
    private readonly transactionService;
    private readonly userService;
    constructor(transactionService: TransactionService, userService: UserService);
    findAll(): Promise<import("./transaction.entity").Transaction[]>;
    createFromFile(file: Express.Multer.File, response: Response): Promise<Response<any, Record<string, any>>>;
    getTransaction(id: number): Promise<import("./transaction.entity").Transaction>;
}
