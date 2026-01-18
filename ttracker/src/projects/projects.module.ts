import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { StatusesService } from 'src/statuses/statuses.service';
import { UsersProjectRoleService } from 'src/users-project-role/users-project-role.service';
import { TasksService } from 'src/task/task.service';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [ProjectsService, StatusesService, UsersProjectRoleService, TasksService, UsersService],
  controllers: [ProjectsController]
})
export class ProjectsModule {}
