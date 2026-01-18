import { IsOptional, IsString, IsDateString, IsInt, IsBoolean, IsNumber } from 'class-validator';

export class UpdateCompanyDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsNumber()
	ownerId?: number;
}
