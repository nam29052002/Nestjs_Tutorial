import { HttpException, Inject, Injectable, forwardRef } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { User } from "./user.entity";
import { UserDTO } from "./user.dto";
import { plainToClass } from "class-transformer";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async getUserById(id: number, expose: boolean): Promise<UserDTO> {
        const user: User = await this.userRepository.getUserById(id);
        if (user == null) {
            throw new HttpException('User is not exists', 400);
        }
        if (expose == true) {
            return user;
        }
        return plainToClass(UserDTO, user,{excludeExtraneousValues: true});
    }

    async getUserByEmail(email: string, expose: boolean): Promise<UserDTO> {
        const user: User = await this.userRepository.getUserByEmail(email);
        if (user == null) {
            throw new HttpException('User is not exists', 400);
        }
        if (expose == true) {
            return user;
        }
        return plainToClass(UserDTO, user, {excludeExtraneousValues: true});
    }
}