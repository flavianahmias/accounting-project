import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinTable,
  OneToMany,
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

  @OneToMany((type) => User, (user) => user.creator)
  affiliates: User[];

  @ManyToOne(
    (type) => User,
    (user) => {
      user.affiliates;
    },
    { nullable: true, cascade: true },
  )
  @JoinTable()
  creator?: User;
}
