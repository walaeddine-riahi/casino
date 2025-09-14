import {
  MongoErrorFilter,
  ValidationErrorFilter,
} from '@casino-application/shared';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NotificationModule } from './notification.module';

async function bootstrap() {
  const queueUrl =
    process.env.MESSAGE_BROKER_SERVICE_QUEUE_URL || 'amqp://localhost:5672';
  const queueName =
    process.env.MESSAGE_BROKER_SERVICE_QUEUE_NAME || 'promotion_queue';

  const app = await NestFactory.create(NotificationModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [queueUrl],
      queue: queueName,
      queueOptions: {
        durable: false,
      },
    },
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new ValidationErrorFilter(), new MongoErrorFilter());

  await app.startAllMicroservices();
  await app.listen(8001);
}
bootstrap();
