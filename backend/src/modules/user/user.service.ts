import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  getUser(): string {
    return 'User!';
  }

  createUsers(usernames: string[]) {
    const users = usernames.map(
      (username) => new User({ name: username, balance: 0 }),
    );

    return this.userRepository.insert(users);
  }
}
