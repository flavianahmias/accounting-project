import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.services';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get all users
   * @returns all users array
   */
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  /**
   * Get user by id
   * @returns user id
   */
  @Get('/:id')
  async getUser(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }
}
