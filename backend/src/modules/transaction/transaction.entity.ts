import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Transaction {
  constructor(obj: Partial<Transaction>) {
    Object.assign(this, obj);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: number;

  @Column({ length: 50 })
  product: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  value: number;

  @ManyToOne(() => User)
  seller: User;
}
