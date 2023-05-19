import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  product: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  value: number;

  @Column('int')
  seller: number;
}
