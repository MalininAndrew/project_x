import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ALREADY_REGISTRED_READY, NOT_FOUND_USER_ERROR } from './users.constants';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePassDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/interfaces/jwt.interface';
import { log } from 'console';

@Controller('users')
export class UsersController {

	constructor(private readonly usersService: UsersService) {}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	async create(@Body() dto: CreateUserDto) {
		const user = await this.usersService.findUserByEmail(dto.email);

		if(user) {
			throw new BadRequestException(ALREADY_REGISTRED_READY);
		}

		return this.usersService.createUser(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get('finduser')
	async findUser(@Req() req: Request) {
		const { email } = req.user as JwtPayload

		const user = await this.usersService.findUserByEmail(email);

		if (!user) {
			throw new UnauthorizedException(NOT_FOUND_USER_ERROR);
		}
		
		return user
	}

	@UseGuards(JwtAuthGuard)
	@Patch('updateuser')
	async updateUser(@Body() user: UpdateUserDto) {
		return this.usersService.updateUser(user);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('changepass')
	async changePass(@Body() user: ChangePassDto) {
		return this.usersService.changePassword(user);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':userId')
	async deleteUser(@Param('userId') userId: number) {
		console.log(userId)
		return this.usersService.deleteUser(userId);
	}
}
