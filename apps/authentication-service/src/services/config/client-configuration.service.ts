import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';

type ClientServices = 'userService';

@Injectable()
export class ClientConfigurationService {
  private clientConfigurations: Record<ClientServices, ClientOptions>;

  constructor(configService: ConfigService) {
    const userServiceHost =
      configService.getOrThrow<string>('USER_SERVICE_HOST');

    this.clientConfigurations = {
      userService: {
        transport: Transport.TCP,
        options: {
          host: userServiceHost,
          port: 8003,
        },
      },
    };
  }

  get(key: ClientServices): ClientOptions {
    return this.clientConfigurations[key];
  }
}
