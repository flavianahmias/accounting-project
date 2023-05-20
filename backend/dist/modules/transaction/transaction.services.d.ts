/// <reference types="multer" />
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { User } from '../user/user.entity';
import { UserFromTransaction } from '../user/user.service';
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
    getUsersFromFile(fileTransactions: FileTransaction[]): Promise<UserFromTransaction[]>;
    isActiveUser(username: string): Promise<boolean>;
    createTransaction(transactionFile: FileTransaction): Promise<Transaction>;
    createTransactions(transactions: FileTransaction[]): Promise<Promise<Transaction>[]>;
}
export {};
