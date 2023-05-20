import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';

export enum Role {
  Creator,
  Affiliate,
}

@Entity()
export class User {
  constructor(dto: Partial<User>) {
    Object.assign(this, dto);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column()
  role: number;

  @Column('float')
  balance: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinTable()
  creator?: User;
}
