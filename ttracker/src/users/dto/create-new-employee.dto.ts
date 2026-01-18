import { IsString, IsNumber, IsEmail } from "class-validator";

export class CreateEmployeeDto {
	@IsString()
	name: string;

	@IsEmail()
	email: string;

	@IsString()
	password: string;
	
	@IsNumber()
	roleId: number;
	
	@IsNumber()
	companyId: number;
}