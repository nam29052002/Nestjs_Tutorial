import { HttpException, Injectable, UseFilters } from "@nestjs/common";
import { UserDTO } from "./user.dto";
import { User } from "./user.entity";
import * as fs from "fs";
import { plainToClass } from "class-transformer";
@Injectable()
export class UserRepository {
    private dataBase: any;
    private tableName: string = "users";

    private readData(): void {
        const data = fs.readFileSync('./db.json', 'utf8');
        this.dataBase = JSON.parse(data);
    }

    private writeData(data): void {
        fs.writeFileSync('./db.json', data);
    }

    async getUserById(id: number): Promise<UserDTO> {
        this.readData();
        const users: User[] = this.dataBase[this.tableName];
        for (let i = 0; i < users.length; i++) {
            if (users[i].id == id) {
                return plainToClass(UserDTO, {...users[i]}, {excludeExtraneousValues: true});
            }
        }
        throw new Error('User id not exist!');
    }

    async getPageUser(page: number): Promise<UserDTO[]> {
        this.readData();
        const users: User[] = this.dataBase[this.tableName];
        
        const start: number = (page - 1) * 5;
        if (start >= users.length) {
            // throw new HttpException('Out of page', 500);
            throw new Error('Out of page');
        }
        let end: number = start + 4;
        end = (end <= users.length - 1) ? (start + 4) : (users.length - 1);

        let listUserDTO: UserDTO[] = [];
        for (let i = start; i <= end; i++) {
            listUserDTO.push(plainToClass(UserDTO, users[i], {excludeExtraneousValues: true}));
        }
        return listUserDTO;
    }

    async createNewUser(user: User): Promise<UserDTO> {
        this.readData();
        const users: User[] = this.dataBase[this.tableName];
        user.id = users.length + 1;

        users.push(user);
        this.writeData(JSON.stringify({"users": users}));

        return plainToClass(UserDTO, user, {excludeExtraneousValues: true});
    }

    async updateUserById(user: User): Promise<UserDTO> {
        this.readData();
        const users: User[] = this.dataBase[this.tableName];

        for (let i = 0; i < users.length; i++) {
            if (users[i].id == user.id) {
                users[i] = user;
                this.writeData(JSON.stringify({"users": users}));
                return plainToClass(UserDTO, user, {excludeExtraneousValues: true});
            }
        }

        throw new Error('User id not exist!');
    }

    async deleteUserById(id: number): Promise<{id: number, message: string}> {
        this.readData();
        const users: User[] = this.dataBase[this.tableName];

        for (let i = 0; i < users.length; i++) {
            if (users[i].id == id) {
                users.splice(id - 1, 1);
                this.writeData(JSON.stringify({"users": users}));
                return {id: id, message: 'success'};
            }
        }

        throw new Error('User id not exist!');
    }
}