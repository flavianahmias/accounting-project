export declare class User {
    constructor(dto: Partial<User>);
    id: number;
    name: string;
    role: number;
    balance: number;
    creator?: User;
}
