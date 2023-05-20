import { User } from '../user/user.entity';
export declare class Transaction {
    constructor(obj: Partial<Transaction>);
    id: number;
    product: string;
    date: Date;
    value: number;
    seller: User;
}
