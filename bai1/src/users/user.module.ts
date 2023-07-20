import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserMockService } from "./user-mock.service";
import { StoreConfig } from "../store/store.config"
import { StoreService } from "../store/store.service";
import { StoreModule } from "src/store/store.module";
import { LoggerCustomService } from "src/logger/logger-custom.service";
import { SecurityCustomService } from "./security.service";

function createStore(storeConfig: StoreConfig): StoreService {
    // logic...
    console.log('Line 11 user.module: ', storeConfig);
    return new StoreService(storeConfig);
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
                dirname: 'store',
                filename: 'data.json'
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
        },
        LoggerCustomService,
        SecurityCustomService
    ],
    imports: [StoreModule.forFeature({
        filename: 'user.json'
    })]
})
export class UserModule {

}