import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationController } from './controllers/notification.controller';
import { NotificationWebSocket } from './websockets/notification.websocket';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [NotificationController],
  providers: [NotificationWebSocket],
})
export class NotificationModule {}
