import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { UsersService } from 'src/users/users.service';
import { CreateEmployeeDto } from 'src/users/dto/create-new-employee.dto';
import { ALREADY_REGISTRED_READY } from 'src/users/users.constants';

@Controller('company')
export class CompanyController {

	constructor(
		private readonly companyService: CompanyService,
		private readonly userService: UsersService
	) {}

	@UseGuards(JwtAuthGuard)
	@Get(':companyId/users')
	findUserByCompanyId(@Param('companyId') companyId: number) {
		return this.userService.findUsersByCompanyId(companyId);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('update/:companyId')
	async updateUser(@Param('companyId') companyId: number, @Body() dto: UpdateCompanyDto) {
		return this.companyService.updateCompany(companyId, dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':companyId')
	getCompanyData(@Param('companyId') companyId: number) {
		return this.companyService.getCompanyData(companyId);
	}

	@UseGuards(JwtAuthGuard)
	@Post('createNewEmployee')
	async createNewEmployee(@Body() dto: CreateEmployeeDto) {
		const user = await this.userService.findUserByEmail(dto.email);
		
		if(user) {
			throw new BadRequestException(ALREADY_REGISTRED_READY);
		}

		return this.userService.createNewEmployee(dto);
	}
}
