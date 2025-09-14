import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { PromotionController } from './controllers/promotion.controller';
import { PromotionSchema } from './schemas/promotion.schema';
import { ClientConfigurationService } from './services/config/client-configuration.service';
import { MongoConfigService } from './services/config/mongo-config.service';
import { PromotionService } from './services/promotion.service';

const clientProviders = [
  {
    provide: 'MESSAGE_BROKER_SERVICE',
    useFactory: (clientConfigService: ClientConfigurationService) => {
      const userServiceOptions = clientConfigService.get(
        'messageBrokerService',
      );
      return ClientProxyFactory.create(userServiceOptions);
    },
    inject: [ClientConfigurationService],
  },
  {
    provide: 'USER_SERVICE',
    useFactory: (clientConfigService: ClientConfigurationService) => {
      const userServiceOptions = clientConfigService.get('userService');
      return ClientProxyFactory.create(userServiceOptions);
    },
    inject: [ClientConfigurationService],
  },
];

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    MongooseModule.forFeature([
      {
        name: 'Promotion',
        schema: PromotionSchema,
      },
    ]),
  ],
  controllers: [PromotionController],
  providers: [...clientProviders, PromotionService, ClientConfigurationService],
})
export class PromotionModule {}
