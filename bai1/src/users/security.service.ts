import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { UserService } from "./user.service";

@Injectable()
export class SecurityCustomService {
    constructor(@Inject(forwardRef(() => 'USER_SERVICE')) private userService: UserService) {}
}