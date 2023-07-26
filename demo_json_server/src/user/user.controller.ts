import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Put, Query, UseFilters } from "@nestjs/common";
import { UserDTO } from "./user.dto";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { UserFilter } from "./user.filter";

@Controller('api/user')
export class UserController {
    constructor(@Inject(UserService) private readonly userService: UserService) {}

    @Get(':id')
    getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserDTO> {
        return this.userService.getUserById(id);
    }

    @Get()
    @UseFilters(UserFilter)
    getPageUser(@Query('page') page: number): Promise<UserDTO[]> {
        return this.userService.getPageUser(page);
    }

    @Post('create')
    createNewUser(@Body() data: any): Promise<UserDTO> {
        const user: User = {...data, id: -1};
        return this.userService.createNewUser(user);
    }

    @Put('update/:id')
    updateUserById(@Param('id', ParseIntPipe) id, @Body() data: any): Promise<UserDTO> {
        const user: User = {...data, id: id};
        return this.userService.updateUserById(user);
    }

    @Delete('delete/:id')
    deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<{id: number, message: string}> {
        return this.userService.deleteUserById(id);
    }
}