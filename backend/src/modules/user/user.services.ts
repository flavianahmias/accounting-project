import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role, User } from './user.entity';

export interface UserFromTransaction {
  username: string;
  role: Role;
  creatorName?: string;
  balance?: number;
}
@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  /**
   * Get all users
   * @returns all users array
   */
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['creator'],
    });
  }

  /**
   * Get user by id
   * @param id user id
   * @returns user
   */
  async getUserById(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['creator'],
    });
  }

  /**
   * Create the users
   * @param usersFromTransaction
   * @returns
   */
  async createUsers(usersFromTransaction: UserFromTransaction[]) {
    const creators = usersFromTransaction.filter(
      (u) => u.role === Role.Creator,
    );

    const affiliates = usersFromTransaction.filter(
      (u) => u.role === Role.Affiliate,
    );

    //Array with users creators
    const creatorUsers = creators.map(
      (c) =>
        new User({
          balance: 0,
          name: c.username,
          role: c.role,
        }),
    );

    await this.userRepository.insert(creatorUsers);

    const promises: Promise<User>[] = affiliates.map(async (affiliate) => {
      //Find for the affiliate creator
      const creator = await this.userRepository.findOne({
        where: { name: affiliate.creatorName },
      });

      return new User({
        balance: 0,
        creator,
        name: affiliate.username,
        role: affiliate.role,
      });
    });

    const users = await Promise.all(promises);
    return this.userRepository.insert(users);
  }

  /**
   * Upload user balance
   * @param id user id
   * @param amount value
   * @returns upload user
   */
  async changeBalanceToUser(id: number, amount: number) {
    const foundUser = await this.userRepository.findOneOrFail({
      where: {
        id,
      },
    });
    foundUser.balance += amount;
    return this.userRepository.save(foundUser);
  }
}
