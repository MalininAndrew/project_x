import { IsNumber, IsOptional } from "class-validator";

export class UpdateUsersProjectRoleDto {
	@IsNumber()
	id: number;

	@IsOptional()
	@IsNumber()
	roleId?: number;
}