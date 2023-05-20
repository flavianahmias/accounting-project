import { TransactionService } from './transaction.services';
export declare class TransactionController {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
    findAll(): Promise<import("./transaction.entity").Transaction[]>;
}
