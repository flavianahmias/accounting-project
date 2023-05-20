import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

export enum TransactionType {
  CreatorSell = 1,
  AffiliateSell,
  PaidComission,
  ReceivedComission,
}

@Entity()
export class Transaction {
  constructor(obj: Partial<Transaction>) {
    Object.assign(this, obj);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: TransactionType;

  @Column({ length: 50 })
  product: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  value: number;

  @ManyToOne(() => User, { cascade: true })
  seller: User;
}
