import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';

type ClientServices =
  | 'promotionService'
  | 'userService'
  | 'authenticationService';

@Injectable()
export class ClientConfigurationService {
  private clientConfigurations: Record<ClientServices, ClientOptions>;

  constructor(configService: ConfigService) {
    const authenticationServiceHost = configService.getOrThrow<string>(
      'AUTHENTICATION_SERVICE_HOST',
    );
    const userServiceHost =
      configService.getOrThrow<string>('USER_SERVICE_HOST');
    const promotionServiceHost = configService.getOrThrow<string>(
      'PROMOTION_SERVICE_HOST',
    );

    this.clientConfigurations = {
      authenticationService: {
        transport: Transport.TCP,
        options: {
          host: authenticationServiceHost,
          port: 8002,
        },
      },
      userService: {
        transport: Transport.TCP,
        options: {
          host: userServiceHost,
          port: 8003,
        },
      },
      promotionService: {
        transport: Transport.TCP,
        options: {
          host: promotionServiceHost,
          port: 8004,
        },
      },
    };
  }

  get(key: ClientServices): ClientOptions {
    return this.clientConfigurations[key];
  }
}
