import {
  CreatePromotionDto,
  PromotionType,
  User,
  UserRole,
} from '@casino-application/shared';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Authentication } from '../decorators/authentication.decorator';
import { UserHttp } from '../decorators/user.decorator';

@Controller('/promotion')
export class PromotionController {
  constructor(
    @Inject('PROMOTION_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Get('/health')
  health(): Promise<string> {
    return firstValueFrom(this.client.send<string>('promotion_health', {}));
  }

  @Get('/all')
  getAll(): Promise<PromotionType[]> {
    return firstValueFrom(
      this.client.send<PromotionType[]>('promotion_get_all', {}),
    );
  }

  @Get('/user')
  @Authentication(true)
  getForUser(@UserHttp() user: User | null): Promise<PromotionType[]> {
    if (!user) throw new UnauthorizedException();

    return firstValueFrom(
      this.client.send<PromotionType[]>('promotion_get_for_user', {
        userId: user._id,
      }),
    );
  }

  @Post(':promotionId/claim')
  @Authentication(true)
  async claim(
    @UserHttp() user: User | null,
    @Param('promotionId') promotionId: string,
  ): Promise<void> {
    if (!user) throw new UnauthorizedException();

    await firstValueFrom(
      this.client.send<void>('promotion_claim', {
        userId: user._id,
        promotionId,
      }),
      { defaultValue: undefined },
    );
  }

  @Post()
  @Authentication(true)
  create(
    @UserHttp() user: User | null,
    @Body() dto: CreatePromotionDto,
  ): Promise<PromotionType> {
    if (!user || user.role === UserRole.CLIENT)
      throw new UnauthorizedException();

    return firstValueFrom(
      this.client.send<PromotionType>('promotion_create', dto),
    );
  }
}
