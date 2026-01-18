import { Module } from '@nestjs/common';
import { UsersProjectRoleService } from './users-project-role.service';
import { UsersProjectRoleController } from './users-project-role.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [UsersProjectRoleController],
  providers: [UsersProjectRoleService, UsersService],
  exports: [UsersProjectRoleService]
})
export class UsersProjectRoleModule {}
