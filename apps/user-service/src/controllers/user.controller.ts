import {
  CreateUserDto,
  LoginDto,
  User,
  UserDto,
} from '@casino-application/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from '../services/user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user_health')
  health(): string {
    return 'User Service is running!';
  }

  @MessagePattern('user_create')
  async create(@Payload() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @MessagePattern('user_get_by_login_credentials')
  async getByLoginCredentials(@Payload() loginDto: LoginDto): Promise<User> {
    return this.userService.getByLoginCredentials(loginDto);
  }

  @MessagePattern('user_get_by_id')
  async getById(@Payload() id: string): Promise<UserDto> {
    return this.userService.getById(id);
  }

  @MessagePattern('user_create_staff')
  async createStaff(@Payload() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createStaff(createUserDto);
  }

  @MessagePattern('user_increase_balance')
  async increaseBalance(
    @Payload() dto: { userId: string; amount: number },
  ): Promise<void> {
    await this.userService.increaseBalance(dto);
  }
}
