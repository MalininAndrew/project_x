import { IsString, IsNumber, IsOptional } from "class-validator";

export class UpdateProjectDto {
	@IsNumber()
	id: number;

	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	description?: string;
}