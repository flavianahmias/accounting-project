import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';

@Entity()
export class User {
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
