import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsEmail()
	email: string;
	
	@IsOptional()
	@IsNumber()
	roleId?: number;

	@IsOptional()
	@IsNumber()
	companyId: number;
}