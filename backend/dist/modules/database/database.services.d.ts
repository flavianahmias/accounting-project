import { DataSource } from 'typeorm';
export declare const databaseServices: {
    provide: string;
    useFactory: () => Promise<DataSource>;
}[];
