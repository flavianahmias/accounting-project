import { DataSource } from 'typeorm';
import { Transaction } from 'src/modules/transaction/transaction.entity';
export declare const transactionProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Transaction>;
    inject: string[];
}[];
