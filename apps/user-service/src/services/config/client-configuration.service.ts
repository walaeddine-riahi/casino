import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';

type ClientServices = 'promotionService';

@Injectable()
export class ClientConfigurationService {
  private clientConfigurations: Record<ClientServices, ClientOptions>;

  constructor(configService: ConfigService) {
    const promotionServiceHost = configService.getOrThrow<string>(
      'PROMOTION_SERVICE_HOST',
    );

    this.clientConfigurations = {
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
