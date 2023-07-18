import { Inject, Injectable } from "@nestjs/common";
import { UserDTO } from "./user.dto";
import { StoreConfig } from "src/store/store.config";
import { StoreService } from "./store.service";

@Injectable()
export class UserService {

    constructor(@Inject('STORE_CONFIG') readonly storeConfig: StoreConfig,
                @Inject('STORE_SERVICE') private readonly storeService: StoreService) {
        
        console.log(storeConfig);
    }

    createUser(user: UserDTO): UserDTO {
        user.createdAt = new Date();
        user.updatedAt = new Date();
        const userReal = UserDTO.plainToClass(user); // transform to real defined UserDTO
        this.storeService.save(user);
        return userReal;
    }
}