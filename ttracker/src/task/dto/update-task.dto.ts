import { IsOptional, IsString, IsDateString, IsInt, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  taskName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  executorId?: number;

  @IsOptional()
  @IsInt()
  creatorId?: number;

  @IsOptional()
  @IsDateString()
  deadline?: string | null;

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsInt()
  statusId?: number;

  @IsOptional()
  @IsInt()
  priorityId?: number;

  @IsOptional()
  @IsDateString()
  timeSpent?: string;

  @IsOptional()
  @IsInt()
  parentTaskId?: number;

  @IsOptional()
  @IsBoolean()
  isSubtask?: boolean;

  @IsOptional()
  @IsBoolean()
  isDone?: boolean;
}
