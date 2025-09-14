import {
  AccessTokenPayload,
  DecodeAccessTokenDto,
} from '@casino-application/shared';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('AUTHENTICATION_SERVICE')
    private readonly authenticationServiceClient: ClientProxy,
    @Inject('USER_SERVICE')
    private readonly userServiceClient: ClientProxy,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const secured = this.reflector.get<boolean>(
      'secured',
      context.getHandler(),
    );

    if (!secured) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeaderValue: string = request.headers['authorization'];
    if (!authHeaderValue) throw new UnauthorizedException();
    const accessTokenString = authHeaderValue.replace('Bearer ', '');
    const decodeDto: DecodeAccessTokenDto = { accessTokenString };
    const userTokenInfo = await firstValueFrom(
      this.authenticationServiceClient
        .send<AccessTokenPayload>('authentication_decode', decodeDto)
        .pipe(catchError(() => throwError(() => new UnauthorizedException()))),
    );

    const user = await firstValueFrom(
      this.userServiceClient
        .send('user_get_by_id', userTokenInfo.userId)
        .pipe(catchError(() => throwError(() => new UnauthorizedException()))),
    );

    request.user = user;

    return true;
  }
}
