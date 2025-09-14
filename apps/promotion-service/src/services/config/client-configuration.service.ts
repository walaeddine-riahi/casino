import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';

type ClientServices = 'messageBrokerService' | 'userService';

@Injectable()
export class ClientConfigurationService {
  private clientConfigurations: Record<ClientServices, ClientOptions>;

  constructor(configService: ConfigService) {
    const messageBrokerServiceQueueName = configService.getOrThrow<string>(
      'MESSAGE_BROKER_SERVICE_QUEUE_NAME',
    );
    const messageBrokerServiceQueueUrl = configService.getOrThrow<string>(
      'MESSAGE_BROKER_SERVICE_QUEUE_URL',
    );
    const userServiceHost =
      configService.getOrThrow<string>('USER_SERVICE_HOST');

    this.clientConfigurations = {
      messageBrokerService: {
        transport: Transport.RMQ,
        options: {
          urls: [messageBrokerServiceQueueUrl],
          queue: messageBrokerServiceQueueName,
          queueOptions: {
            durable: false,
          },
        },
      },
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
