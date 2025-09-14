import { PromotionType } from '@casino-application/shared';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationWebSocket } from '../websockets/notification.websocket';

@Controller()
export class NotificationController {
  constructor(private readonly notificationWebSocket: NotificationWebSocket) {}

  @MessagePattern('promotion_created')
  async create(@Payload() promotion: PromotionType): Promise<void> {
    Logger.debug(
      'Promotion received by notification service',
      JSON.stringify(promotion),
    );

    // If we want to send message to specific user we could append user id to the ws topic
    // For the sake of simplicity of the app this is omitted
    this.notificationWebSocket.server.emit('ws_promotion_created', promotion);
  }
}
