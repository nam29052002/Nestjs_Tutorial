import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UsePipes,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtBlaclistGuard } from '../authen/blacklist/jwt.blacklist.guard';
import { AuthorAdminGuard } from '../author/author.guard';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'), JwtBlaclistGuard)
  @Get('me')
  async userDetail(@Req() request: Request): Promise<UserDTO> {
    const idUser: number = request['user']['sub'];
    const userDTO: UserDTO = await this.userService.getUserByIdOrEmail(
      idUser,
      false,
    );
    userDTO.trangThai = 1;
    return userDTO;
  }

  @UseGuards(AuthGuard('jwt'), JwtBlaclistGuard, AuthorAdminGuard)
  @Get('search')
  async search(
    @Query('name') name: string,
    @Query('page', ParseIntPipe) page: number,
  ): Promise<UserDTO[]> {
    return this.userService.searchUserByName(name, page);
  }

  @UseGuards(AuthGuard('jwt'), JwtBlaclistGuard, AuthorAdminGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@Body() userDTO: UserDTO): Promise<{ status: string }> {
    return this.userService.createUser(userDTO);
  }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() userDTO: UserDTO): Promise<{ accessToken: string, refreshToken: string }> {
    return this.userService.registerUser(userDTO);
  }

  @UseGuards(AuthGuard('jwt'), JwtBlaclistGuard, AuthorAdminGuard)
  @Put(':id')
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() userDTO: UserDTO,
  ): Promise<{ status: string }> {
    return this.userService.updateUserByIdOrEmail(id, userDTO);
  }

  @UseGuards(AuthGuard('jwt'), JwtBlaclistGuard, AuthorAdminGuard)
  @UsePipes(new ValidationPipe())
  @Put()
  async updateByEmail(
    @Body('email') email: string,
    @Body() userDTO: UserDTO,
  ): Promise<{ status: string }> {
    return this.userService.updateUserByIdOrEmail(email, userDTO);
  }

  @UseGuards(AuthGuard('jwt'), JwtBlaclistGuard, AuthorAdminGuard)
  @Delete(':id')
  async deleteById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ status: string }> {
    return this.userService.deleteUserByIdOrEmail(id);
  }

  @UseGuards(AuthGuard('jwt'), JwtBlaclistGuard, AuthorAdminGuard)
  @Delete()
  async deleteByEmail(
    @Body('email') email: string,
  ): Promise<{ status: string }> {
    return this.userService.deleteUserByIdOrEmail(email);
  }
}
