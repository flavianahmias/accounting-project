import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
export declare class TransactionService {
    private transactionRepository;
    constructor(transactionRepository: Repository<Transaction>);
    findAll(): Promise<Transaction[]>;
}
