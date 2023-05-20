/// <reference types="multer" />
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { User } from '../user/user.entity';
declare enum SellType {
    ProductorSell = 1,
    AffiliateSell = 2,
    PaidComission = 3,
    ReceivedComission = 4
}
interface FileTransaction {
    type: SellType;
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
    getTransactionByUser(userId: number): Promise<Transaction[]>;
    saveTransaction(transaction: Transaction): Promise<Transaction>;
    readTransactionFile(file: Express.Multer.File): FileTransaction[];
    getMissingUsers(usernames: string[]): Promise<string[]>;
    createTransaction(transactionFile: FileTransaction): Promise<Transaction>;
    createTransactions(transactions: FileTransaction[]): Promise<Promise<Transaction>[]>;
}
export {};
