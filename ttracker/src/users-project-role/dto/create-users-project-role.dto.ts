import { IsNumber } from "class-validator";

export class CreateUsersProjectRoleDto {
	@IsNumber()
	userId: number;

	@IsNumber()
	projectId: number;

	@IsNumber()
	roleId: number;
}