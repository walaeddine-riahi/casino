import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const Authentication = (secured: boolean): CustomDecorator<string> => {
  return SetMetadata('secured', secured);
};
