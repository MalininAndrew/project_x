import { Injectable, NotFoundException } from '@nestjs/common';
import { Company, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
	constructor(private readonly prisma: PrismaService) {}

	async getCompanyData(id: number): Promise<Company | null> {
		return this.prisma.company.findUnique({
			where: {
				id
			}
		})
	}

	async updateCompany(id: number, dto: UpdateCompanyDto): Promise<Company | null> {
		const company = await this.prisma.company.findUnique({ where: { id } });
		if (!company) throw new NotFoundException(NOT_FOUND_COMPANY_ERROR);
	
		return this.prisma.company.update({
			where: { id },
			data: {
				...dto
			},
		});
	}
}
