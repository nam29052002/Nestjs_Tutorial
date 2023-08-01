import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    async getUserById(id: number): Promise<User> {
        const resultSet = await this.userRepository.query(
            'select * from "user" where id = $1;',
            [id]
        );
        if (resultSet.length == 0) {
            return null;
        }
        return User.itemMapTOUser(resultSet[0]);
    }

    async getUserByEmail(email: string): Promise<User> {
        const resultSet = await this.userRepository.query(
            'select * from "user" where email = $1;',
            [email]
        );
        if (resultSet.length == 0) {
            return null;
        }
        return User.itemMapTOUser(resultSet[0]);
    }
}