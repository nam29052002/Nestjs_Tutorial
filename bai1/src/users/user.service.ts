import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { UserDTO } from "./user.dto";
import { StoreConfig } from "src/store/store.config";
import { StoreService } from "../store/store.service";
import { LoggerCustomService } from "src/logger/logger-custom.service";
import { SecurityCustomService } from "./security.service";

@Injectable()
export class UserService {

    constructor(/*@Inject('STORE_CONFIG') private readonly storeConfig: StoreConfig,
                @Inject('STORE_SERVICE') private readonly storeServiceUseFactory: StoreService,*/
                @Inject('STORE_SERVICE_user.json') private readonly storeService: StoreService,
                private readonly loggerCustomService: LoggerCustomService,
                @Inject(forwardRef(() => SecurityCustomService)) private readonly securityService: SecurityCustomService) {
        
        console.log(storeService);
    }

    createUser(user: UserDTO): UserDTO {
        user.createdAt = new Date();
        user.updatedAt = new Date();
        const userReal = UserDTO.plainToClass(user); // transform to real defined UserDTO
        this.storeService.save(user);
        return userReal;
    }

    getLogger(): LoggerCustomService {
        return this.loggerCustomService
    }
}