import { CreatePromotionDto, PromotionType } from '@casino-application/shared';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PromotionService {
  constructor(
    @InjectModel('Promotion')
    private promotionModel: Model<PromotionType>,
    @Inject('MESSAGE_BROKER_SERVICE')
    private readonly messageBrokerService: ClientProxy,
    @Inject('USER_SERVICE')
    private readonly userService: ClientProxy,
  ) {}

  async create(dto: CreatePromotionDto): Promise<PromotionType> {
    const promotionModel = new this.promotionModel({
      title: dto.title,
      description: dto.description,
      amount: dto.amount,
      userId: dto.userId,
      isActive: true,
    });

    const promotion = await promotionModel.save();

    firstValueFrom(
      this.messageBrokerService.send('promotion_created', promotion),
      { defaultValue: undefined },
    ).catch((err) =>
      Logger.error('Failed to send message to promotion_created', err),
    );

    return promotion;
  }

  async claim(dto: { userId: string; promotionId: string }): Promise<void> {
    const promotion = await this.promotionModel.findById(dto.promotionId);

    if (!promotion || promotion.userId !== dto.userId)
      throw new RpcException({
        statusCode: 404,
        message: 'Promotion not found',
      });

    if (!promotion.isActive)
      throw new RpcException({
        statusCode: 400,
        message: 'Promotion is not active',
      });

    await firstValueFrom(
      this.userService.send('user_increase_balance', {
        amount: promotion.amount,
        userId: dto.userId,
      }),
      { defaultValue: undefined },
    );

    promotion.isActive = false;
    await promotion.save();
  }

  async getAll(): Promise<PromotionType[]> {
    return this.promotionModel.find();
  }

  async getForUser(userId: string): Promise<PromotionType[]> {
    return this.promotionModel.find({ userId });
  }
}
