import { User as UserType } from '@casino-application/shared';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserHttp = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return (request.user as UserType) ?? null;
  },
);
