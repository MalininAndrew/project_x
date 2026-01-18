import { IsString, IsNumber, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateStatusDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsNumber()
	sortIndex?: number;
}