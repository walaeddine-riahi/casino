import {
  LoginDto,
  LoginResponse,
  LogoutDto,
  RefreshDto,
} from '@casino-application/shared';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('/authentication')
export class AuthenticationController {
  constructor(
    @Inject('AUTHENTICATION_SERVICE')
    private readonly authenticationServiceClient: ClientProxy,
  ) {}

  @Get('/health')
  health(): Promise<string> {
    return firstValueFrom(
      this.authenticationServiceClient.send('authentication_health', {}),
    );
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return firstValueFrom(
      this.authenticationServiceClient.send('authentication_login', loginDto),
    );
  }

  @Post('/logout')
  logout(@Body() logoutDto: LogoutDto): Promise<void> {
    return firstValueFrom(
      this.authenticationServiceClient.send('authentication_logout', logoutDto),
      { defaultValue: undefined },
    );
  }

  @Post('/refresh')
  refresh(@Body() refreshDto: RefreshDto): Promise<LoginResponse> {
    return firstValueFrom(
      this.authenticationServiceClient.send(
        'authentication_refresh',
        refreshDto,
      ),
    );
  }
}
