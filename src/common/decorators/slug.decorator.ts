import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Slug = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return (request?.slug) ? request.slug : request;
  },
);