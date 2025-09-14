import { CreatePromotionDto, PromotionType } from '@casino-application/shared';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PromotionService } from '../services/promotion.service';

@Controller()
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @MessagePattern('promotion_health')
  health(): string {
    return 'Promotion Service is running!';
  }

  @MessagePattern('promotion_get_all')
  async getAll(): Promise<PromotionType[]> {
    return this.promotionService.getAll();
  }

  @MessagePattern('promotion_get_for_user')
  async getForUser(
    @Payload() dto: { userId: string },
  ): Promise<PromotionType[]> {
    Logger.debug('Get for user' + JSON.stringify(dto));
    return this.promotionService.getForUser(dto.userId);
  }

  @MessagePattern('promotion_create')
  async create(@Payload() dto: CreatePromotionDto): Promise<PromotionType> {
    Logger.debug('Creating promotion' + JSON.stringify(dto));
    return this.promotionService.create(dto);
  }

  @MessagePattern('promotion_claim')
  async claim(
    @Payload() dto: { userId: string; promotionId: string },
  ): Promise<void> {
    Logger.debug('Claiming promotion' + JSON.stringify(dto));
    await this.promotionService.claim(dto);
  }
}
