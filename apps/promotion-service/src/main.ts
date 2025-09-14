import {
  MongoErrorFilter,
  ValidationErrorFilter,
} from '@casino-application/shared';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PromotionModule } from './promotion.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PromotionModule,
    {
      transport: Transport.TCP,
      options: {
        host: '::',
        port: 8004,
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new ValidationErrorFilter(), new MongoErrorFilter());

  await app.listen();
}
bootstrap();
