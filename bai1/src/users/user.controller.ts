import { Body, Controller, Get, Param, Post, ParseIntPipe, UsePipes, ValidationPipe, Inject } from "@nestjs/common";
import { UserDTO } from "./user.dto";
import { UserService } from "./user.service";
import { ModuleRef } from "@nestjs/core";
import { LoggerCustomService } from "src/logger/logger-custom.service";

@Controller('bai1/user')
export class UserController {

    constructor(@Inject('USER_SERVICE') private readonly userService: UserService,
                private readonly loggerCustomService: LoggerCustomService) {
        
        console.log(userService.getLogger() === loggerCustomService);
    }
    // constructor(private readonly modulRef: ModuleRef) {}

    @UsePipes(new ValidationPipe()) // controller pipe
    @Post()
    createUser(@Body() user: UserDTO): UserDTO {
        // return this.modulRef.get('USER_SERVICE').createUser(user);
        console.log(this.loggerCustomService.log());
        return this.userService.createUser(user);
    }

    @Get(':id')
    getUserById(@Param('id', ParseIntPipe) id: number): UserDTO { // param pipe
        return {
            id: 100,
            name: 'name test',
            createdAt: new Date(),
            updatedAt: new Date(),
            firstName: 'nam first name',
            lastName: 'nam last name',
            fullName: 'hihi',
            username: 'namnamnam',
            password: '123456'
        };
    }

    @Get()
    tesLog(): any {
        return [this.loggerCustomService.log(), this.userService.getLogger().log()];
    }
}