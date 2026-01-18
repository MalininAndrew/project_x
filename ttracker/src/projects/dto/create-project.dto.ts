import { IsString, IsNumber, IsOptional } from "class-validator";

export class CreateProjectDto {
	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsNumber()
	ownerId: number;

	@IsNumber()
	companyId: number;
}

