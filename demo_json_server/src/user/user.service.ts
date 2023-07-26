import { Inject, Injectable } from "@nestjs/common";
import { UserDTO } from "./user.dto";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
    constructor(@Inject(UserRepository) private readonly userRepository: UserRepository) {}
    async getUserById(id: number): Promise<UserDTO> {
        return await this.userRepository.getUserById(id);
    }

    async getPageUser(page: number): Promise<UserDTO[]> {
        return await this.userRepository.getPageUser(page);
    }

    async createNewUser(user: User): Promise<UserDTO> {
        return await this.userRepository.createNewUser(user);
    }

    async updateUserById(user: User): Promise<UserDTO> {
        return await this.userRepository.updateUserById(user);
    }

    async deleteUserById(id: number): Promise<{id: number, message: string}> {
        return await this.userRepository.deleteUserById(id);
    }
}