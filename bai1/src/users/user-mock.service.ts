import { Injectable } from "@nestjs/common";
import { UserDTO } from "./user.dto";

@Injectable()
export class UserMockService {
    createUser(user: UserDTO): UserDTO {
        return UserDTO.plainToClass(
            {
                id: 111,
                createdAt: new Date(),
                updatedAt: new Date(),
                name: "nam mock",
                username: "namnamnam",
                password: "123456",
                firstName: "mock",
                lastName: "mock mock nam",
                fullName: ""
            }
        );
    }
}