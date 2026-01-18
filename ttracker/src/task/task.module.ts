import { Module } from '@nestjs/common';
import { TasksService } from './task.service';
import { TaskController } from './task.controller';

@Module({
  controllers: [TaskController],
  providers: [TasksService],
  exports: [TasksService]
})
export class TaskModule {}
