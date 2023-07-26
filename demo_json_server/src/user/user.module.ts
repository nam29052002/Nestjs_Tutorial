import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserMiddleware } from './user.middleware';

@Module({
    providers: [UserService, UserRepository],
    controllers: [UserController]
})
export class UserModule {
    // configure(consumer: MiddlewareConsumer) {
    //     consumer
    //         .apply(UserMiddleware)
    //         .forRoutes({ path: 'api/user', method: RequestMethod.GET });
    // }
}