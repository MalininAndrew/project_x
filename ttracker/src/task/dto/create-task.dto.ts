import { IsDateString, IsInt, IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateTaskDto {
	@IsInt()
	creatorId: number;

	@IsOptional()
	@IsInt()
	executorId?: number;

	@IsInt()
	projectId: number;

	@IsString()
	@IsNotEmpty()
	taskName: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsInt()
	statusId: number;

	@IsInt()
	priorityId: number;
	
	@IsOptional()	
	@IsInt()
	parentTaskId?: number;

	@IsBoolean()
	isSubtask: boolean;

	@IsOptional()
	@IsDateString()
	deadline?: Date;
}
