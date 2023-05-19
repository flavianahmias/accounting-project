import { User } from '../user/user.entity';
export declare class Transaction {
    id: number;
    product: string;
    date: Date;
    value: number;
    seller: User;
}
