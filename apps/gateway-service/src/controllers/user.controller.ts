import { CreateUserDto, User } from '@casino-application/shared';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Authentication } from '../decorators/authentication.decorator';
import { UserHttp } from '../decorators/user.decorator';

@Controller('/user')
export class UserController {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  @Get('/health')
  health(): Promise<string> {
    return firstValueFrom(this.client.send('user_health', {}));
  }

  @Get('/me')
  @Authentication(true)
  me(@UserHttp() user: User | null): Promise<string> {
    if (!user) throw new UnauthorizedException();

    return firstValueFrom(this.client.send('user_get_by_id', user._id));
  }

  @Post()
  create(@Body() dto: CreateUserDto): Promise<User> {
    return firstValueFrom(this.client.send('user_create', dto));
  }

  @Post('/staff')
  createStaff(@Body() dto: CreateUserDto): Promise<User> {
    return firstValueFrom(this.client.send('user_create_staff', dto));
  }
}
