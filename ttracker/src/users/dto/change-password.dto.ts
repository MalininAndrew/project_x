import { IsEmail, IsString } from "class-validator";

export class ChangePassDto {
	@IsEmail()
	email: string;

	@IsString()
	password: string; 
}