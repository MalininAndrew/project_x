import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
	@IsString()
	@IsNotEmpty()
	description: string;

	@IsInt()
	taskId: number;

	@IsInt()
	userId: number;
}
