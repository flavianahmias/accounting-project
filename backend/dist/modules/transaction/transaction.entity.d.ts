import { User } from '../user/user.entity';
export declare enum TransactionType {
    CreatorSell = 1,
    AffiliateSell = 2,
    PaidComission = 3,
    ReceivedComission = 4
}
export declare class Transaction {
    constructor(obj: Partial<Transaction>);
    id: number;
    type: TransactionType;
    product: string;
    date: Date;
    value: number;
    seller: User;
}
