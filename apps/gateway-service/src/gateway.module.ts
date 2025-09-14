import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ClientProxyFactory } from '@nestjs/microservices';
import { AuthenticationController } from './controllers/authentication.controller';
import { PromotionController } from './controllers/promotion.controller';
import { UserController } from './controllers/user.controller';
import { ClientConfigurationService } from './services/client-configuration.service';
import { AuthenticationGuard } from './services/guards/authentication.guard';

const clientProviders = [
  {
    provide: 'PROMOTION_SERVICE',
    useFactory: (clientConfigService: ClientConfigurationService) => {
      const serviceOptions = clientConfigService.get('promotionService');
      return ClientProxyFactory.create(serviceOptions);
    },
    inject: [ClientConfigurationService],
  },
  {
    provide: 'USER_SERVICE',
    useFactory: (clientConfigService: ClientConfigurationService) => {
      const serviceOptions = clientConfigService.get('userService');
      return ClientProxyFactory.create(serviceOptions);
    },
    inject: [ClientConfigurationService],
  },
  {
    provide: 'AUTHENTICATION_SERVICE',
    useFactory: (clientConfigService: ClientConfigurationService) => {
      const serviceOptions = clientConfigService.get('authenticationService');
      return ClientProxyFactory.create(serviceOptions);
    },
    inject: [ClientConfigurationService],
  },
];

const guards = [
  {
    provide: APP_GUARD,
    useClass: AuthenticationGuard,
  },
];

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [PromotionController, UserController, AuthenticationController],
  providers: [...clientProviders, ...guards, ClientConfigurationService],
})
export class GatewayModule {}
