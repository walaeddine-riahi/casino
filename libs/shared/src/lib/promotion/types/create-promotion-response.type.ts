import { BaseResponse } from '../../response';
import { PromotionType } from './promotion.type';

export type CreatePromotionResponse = BaseResponse & {
  promotion?: PromotionType;
};
