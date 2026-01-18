import { IsNumber } from "class-validator";

export class DeleteUserFromProjectDto {
	@IsNumber()
	userId: number;

	@IsNumber()
	projectId: number;
}