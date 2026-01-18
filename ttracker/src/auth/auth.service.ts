import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ALREADY_REGISTRED_READY, NOT_FOUND_USER_ERROR } from 'src/users/users.constants';
import { compare } from 'bcryptjs';
import { WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly jwtService: JwtService
	) {}

	async registration(dto: RegisterDto) {
		const oldUser = await this.userService.findUserByEmail(dto.email);
		if (oldUser) {
			throw new BadRequestException(ALREADY_REGISTRED_READY)
		}
		const dtoWithRole: CreateUserDto = {roleId: 1, ...dto}
		const user = await this.userService.createUser(dtoWithRole);
		return this.login(user.email)
	}

	async validateUser(email: string, password: string): Promise<Pick<CreateUserDto, 'email'>> {
		const user = await this.userService.findUserByEmail(email);

		if (!user) {
			throw new UnauthorizedException(NOT_FOUND_USER_ERROR);
		}

		const isCorrectPassword = await compare(password, user.password);

		if (!isCorrectPassword) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR)
		}

		return { email: user.email};
	}

	async login(email: string) {
		const payload = { email };
		return {
			access_token: await this.jwtService.signAsync(payload)
		};
	}
}
