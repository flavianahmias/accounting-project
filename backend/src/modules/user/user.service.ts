import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role, User } from './user.entity';

export interface UserFromTransaction {
  username: string;
  role: Role;
  creatorName?: string;
}
@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  getUser(): string {
    return 'User!';
  }

  async createUsers(usersFromTransaction: UserFromTransaction[]) {
    const creators = usersFromTransaction.filter(
      (u) => u.role === Role.Creator,
    );

    const affiliates = usersFromTransaction.filter(
      (u) => u.role === Role.Affiliate,
    );

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
      const creator = await this.userRepository.findOne({
        where: { name: affiliate.creatorName },
      });
      console.log('Found ' + creator?.name + ' for creator');

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
}
