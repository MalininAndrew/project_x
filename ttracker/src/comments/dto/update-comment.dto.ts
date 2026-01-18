import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';


export class UpdateCommentDto {
	@IsNotEmpty()
	@IsOptional()
	@IsString()
	description: string;
}
