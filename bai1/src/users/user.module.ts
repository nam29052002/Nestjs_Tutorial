import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserMockService } from "./user-mock.service";
import { StoreConfig } from "../store/store.config"
import { StoreService } from "./store.service";

function createStore(storeConfig: StoreConfig): StoreService {
    // logic...
    console.log('Line 10 user.module: ', storeConfig);
    return new StoreService();
}

@Module({
    controllers: [UserController],
    // providers: [UserSevice]
    providers: [
        {
            provide: 'USER_SERVICE',
            useClass: UserService
            // useClass: UserMockService
        },
        {
            provide: 'STORE_CONFIG',
            useValue: {
                dir: 'store',
                path: 'user'
            } as StoreConfig
        },
        {
            provide: 'STORE_SERVICE',
            useFactory: createStore,
            inject: [
                {
                    token: 'STORE_CONFIG',
                    optional: true
                }
            ]
        }
    ]
})
export class UserModule {

}