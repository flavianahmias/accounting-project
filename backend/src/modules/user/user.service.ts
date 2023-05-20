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

  createUsers(usersFromTransaction: UserFromTransaction[]) {
    const users = usersFromTransaction.map(
      (userFromTransaction) =>
        new User({
          name: userFromTransaction.username,
          balance: 0,
          role: userFromTransaction.role,
        }),
    );

    return this.userRepository.insert(users);
  }
}
