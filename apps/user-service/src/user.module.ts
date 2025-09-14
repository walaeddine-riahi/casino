import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controllers/user.controller';
import { UserSchema } from './schemas/user.schema';
import { ClientConfigurationService } from './services/config/client-configuration.service';
import { MongoConfigService } from './services/config/mongo-config.service';
import { UserService } from './services/user.service';

const clientProviders = [
  {
    provide: 'PROMOTION_SERVICE',
    useFactory: (clientConfigService: ClientConfigurationService) => {
      const userServiceOptions = clientConfigService.get('promotionService');
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
        name: 'User',
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [...clientProviders, UserService, ClientConfigurationService],
})
export class UserModule {}
