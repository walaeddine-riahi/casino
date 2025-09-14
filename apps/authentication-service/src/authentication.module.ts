import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationController } from './controllers/authentication.controller';
import { RefreshTokenSchema } from './schemas/refresh-token.schema';
import { AuthenticationService } from './services/authentication.service';
import { ClientConfigurationService } from './services/config/client-configuration.service';
import { MongoConfigService } from './services/config/mongo-config.service';

const clientProviders = [
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
        name: 'RefreshToken',
        schema: RefreshTokenSchema,
      },
    ]),
  ],
  controllers: [AuthenticationController],
  providers: [
    ...clientProviders,
    AuthenticationService,
    ClientConfigurationService,
  ],
})
export class AuthenticationModule {}
