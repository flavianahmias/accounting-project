export interface IUser {
  id: number;
  name: string;
  role: number;
  balance: number;
  creator: IUser;
}

export interface ITransaction {
  id: number;
  type: number;
  product: string;
  date: string;
  value: number;
  seller: IUser;
}
