export declare enum Role {
    Creator = 0,
    Affiliate = 1
}
export declare class User {
    constructor(dto: Partial<User>);
    id: number;
    name: string;
    role: number;
    balance: number;
    creator?: User;
}
