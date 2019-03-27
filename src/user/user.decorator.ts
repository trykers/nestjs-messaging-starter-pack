
import { createParamDecorator } from '@nestjs/common';

export const MyUser = createParamDecorator((data, [root, args, ctx, info]) => ctx.req.user)
export const ReqUser = createParamDecorator((data, req) => { return req.user })