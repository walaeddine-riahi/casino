import {
  AccessTokenPayload,
  DecodeAccessTokenDto,
  LoginDto,
  LoginResponse,
  LogoutDto,
  RefreshDto,
  RefreshResponse,
  RefreshToken,
  RefreshTokenPayload,
} from '@casino-application/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { sign, verify } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel('RefreshToken')
    private readonly refreshTokenModel: Model<RefreshToken>,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  async refresh({ refreshString }: RefreshDto): Promise<RefreshResponse> {
    const refreshToken = await this.retrieveRefreshToken(refreshString);
    if (!refreshToken) {
      throw new RpcException({
        statusCode: 404,
        message: `refresh token not found for ${refreshString}`,
      });
    }

    // Could throw if user does not exist, remap to 400
    await firstValueFrom(
      this.userServiceClient.send('user_get_by_id', refreshToken.userId).pipe(
        catchError(() =>
          throwError(
            () =>
              new RpcException({
                statusCode: 400,
                message: 'There is no user associated with given refresh token',
              }),
          ),
        ),
      ),
    );

    return {
      accessToken: this.generateAccessToken({ userId: refreshToken.userId }),
    };
  }

  async login({ email, password }: LoginDto): Promise<LoginResponse> {
    // Could throw if user does not exist, remap to 400
    const user = await firstValueFrom(
      this.userServiceClient
        .send('user_get_by_login_credentials', {
          email,
          password,
        })
        .pipe(
          catchError(() =>
            throwError(
              () =>
                new RpcException({
                  statusCode: 400,
                  message: 'Invalid credentials',
                }),
            ),
          ),
        ),
    );

    const refreshToken = new this.refreshTokenModel({ userId: user._id });
    await refreshToken.save();

    return {
      refreshToken: this.generateRefreshToken({
        refreshTokenId: refreshToken._id,
        userId: user._id,
      }),
      accessToken: this.generateAccessToken({ userId: user._id }),
    };
  }

  async logout({ refreshString }: LogoutDto): Promise<void> {
    const refreshToken = await this.retrieveRefreshToken(refreshString);
    if (refreshToken) {
      await this.refreshTokenModel.deleteOne({ _id: refreshToken._id });
    }
  }

  decode({ accessTokenString }: DecodeAccessTokenDto): AccessTokenPayload {
    return this.decodeAccessToken(accessTokenString);
  }

  private async retrieveRefreshToken(
    refreshString: string,
  ): Promise<RefreshToken | null> {
    const decoded = this.decodeRefreshToken(refreshString);
    return this.refreshTokenModel.findById(decoded.refreshTokenId).exec();
  }

  private generateAccessToken(accessTokenPayload: AccessTokenPayload): string {
    return sign(
      accessTokenPayload,
      this.configService.getOrThrow<string>('ACCESS_SECRET'),
      {
        expiresIn: '1h',
      },
    );
  }

  private generateRefreshToken(
    refreshTokenPayload: RefreshTokenPayload,
  ): string {
    return sign(
      refreshTokenPayload,
      this.configService.getOrThrow<string>('REFRESH_SECRET'),
    );
  }

  private decodeRefreshToken(refreshTokenString: string): RefreshTokenPayload {
    try {
      const decoded = verify(
        refreshTokenString,
        this.configService.getOrThrow('REFRESH_SECRET'),
      );
      if (typeof decoded === 'string')
        throw new RpcException({
          statusCode: 400,
          message: 'Invalid refresh token',
        });

      return decoded as RefreshTokenPayload;
    } catch (err) {
      // Verify could throw an error during decoding if token is invalid
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid refresh token',
      });
    }
  }

  private decodeAccessToken(accessTokenString: string): AccessTokenPayload {
    try {
      const decoded = verify(
        accessTokenString,
        this.configService.getOrThrow('ACCESS_SECRET'),
      );

      if (typeof decoded === 'string')
        throw new RpcException({
          statusCode: 400,
          message: 'Invalid refresh token',
        });

      return decoded as AccessTokenPayload;
    } catch (err) {
      // Verify could throw an error during decoding if token is invalid
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid refresh token',
      });
    }
  }
}
