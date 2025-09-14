import {
  AccessTokenPayload,
  DecodeAccessTokenDto,
  LoginDto,
  LoginResponse,
  LogoutDto,
  RefreshDto,
  RefreshResponse,
} from '@casino-application/shared';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthenticationService } from '../services/authentication.service';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern('authentication_health')
  health(): string {
    return 'Authentication Service is running!';
  }

  @MessagePattern('authentication_login')
  async login(@Payload() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authenticationService.login(loginDto);
  }

  @MessagePattern('authentication_refresh')
  async refresh(@Payload() refreshDto: RefreshDto): Promise<RefreshResponse> {
    return this.authenticationService.refresh(refreshDto);
  }

  @MessagePattern('authentication_logout')
  async logout(@Payload() logoutDto: LogoutDto): Promise<void> {
    return this.authenticationService.logout(logoutDto);
  }

  @MessagePattern('authentication_decode')
  async decode(
    @Payload() decodeAccessTokenDto: DecodeAccessTokenDto,
  ): Promise<AccessTokenPayload> {
    return this.authenticationService.decode(decodeAccessTokenDto);
  }
}
