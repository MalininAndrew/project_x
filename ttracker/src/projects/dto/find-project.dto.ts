import { IsString, IsNumber, IsOptional } from "class-validator";

export class FindProjectsByUserDto {
	@IsNumber()
	userId: number;
}