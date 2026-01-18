import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { genSaltSync, hash, compare} from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePassDto } from './dto/change-password.dto';
import { NOT_FOUND_USER_ERROR } from './users.constants';
import { CreateEmployeeDto } from './dto/create-new-employee.dto';

@Injectable()
export class UsersService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly configService: ConfigService
	) {}

	async createUser({ name, email, password, roleId }: CreateUserDto): Promise<User> {
		const hashPassword = await this.buildHashPassword(password)

		const user = await this.prisma.user.create({
			data: {
				name,
				email,
				password: hashPassword,
				roleId
			}
		})

		const company = await this.prisma.company.create({
			data: {
				name: 'Моя компания',
				ownerId: user.id
			}
		})

		const updatedUser = await this.updateUser({email, companyId: company.id})

		return updatedUser;
	}

	async createNewEmployee({ name, email, password, roleId, companyId }: CreateEmployeeDto): Promise<User> {
		const hashPassword = await this.buildHashPassword(password)

		return this.prisma.user.create({
			data: {
				name,
				email,
				password: hashPassword,
				roleId,
				companyId
			}
		})
	}

	async findUserByEmail(email: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { email },
				select: {
					id: true,
					name: true,
					email: true,
					password: true,
					createDate: true,
					updateDate: true,
					roleId: true,
					companyId: true
				},
		})

		return user
	}

	async findUserById(id: number): Promise<User | null> {
		const user = await this.prisma.user.findUnique({
			where: { id },
				select: {
					id: true,
					name: true,
					email: true,
					password: true,
					createDate: true,
					updateDate: true,
					roleId: true,
					companyId: true
				},
		})

		return user
	}

	async findUsersByCompanyId(companyId: number): Promise<User[] | null> {
		const users = await this.prisma.user.findMany({
			where: {
				companyId
			}
		})

		return users;
	}

	async updateUser({ email, name, roleId, companyId }: UpdateUserDto): Promise<User> {
		return this.prisma.user.update({
			where: {
				email
			},
			data: {
				name,
				roleId,
				companyId
			}
		})
	}

	async changePassword({ email, password}: ChangePassDto) {
		const hashPassword = await this.buildHashPassword(password)
		return this.prisma.user.update({
			where: {
				email
			},
			data: {
				password: hashPassword
			}
		})
	}

	async deleteUser(id: number) {
		return this.prisma.user.delete({
			where: {
				id
			}
		})
	}

	private async buildHashPassword(password: string) {
		const roundsSalt = this.configService.get('BCRYPT_SALT_ROUNDS');
		const salt = genSaltSync(Number(roundsSalt));
		const hashPassword = await hash(password, salt);
		return hashPassword;
	}
}
