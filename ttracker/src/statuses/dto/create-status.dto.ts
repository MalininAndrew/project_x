import { IsString, IsNumber, IsNotEmpty } from "class-validator";

export class CreateStatusDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsNumber()
	projectId: number;

	@IsNotEmpty()
	@IsNumber()
	sortIndex: number;
}