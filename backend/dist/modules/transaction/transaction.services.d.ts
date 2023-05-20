/// <reference types="multer" />
import { Repository } from 'typeorm';
import { TransactionType, Transaction } from './transaction.entity';
import { User } from '../user/user.entity';
import { UserFromTransaction } from '../user/user.service';
interface FileTransaction {
    type: TransactionType;
    date: Date;
    product: string;
    seller: string;
    value: number;
}
export declare class TransactionService {
    private transactionRepository;
    private userRepository;
    constructor(transactionRepository: Repository<Transaction>, userRepository: Repository<User>);
    findAll(): Promise<Transaction[]>;
    saveTransaction(transaction: Transaction): Promise<Transaction>;
    readTransactionFile(file: Express.Multer.File): FileTransaction[];
    getUsersFromFile(fileTransactions: FileTransaction[]): Promise<UserFromTransaction[]>;
    isActiveUser(username: string): Promise<boolean>;
    createTransaction(transactionFile: FileTransaction): Promise<Transaction>;
    createTransactions(transactions: FileTransaction[]): Promise<Transaction[]>;
}
export {};
