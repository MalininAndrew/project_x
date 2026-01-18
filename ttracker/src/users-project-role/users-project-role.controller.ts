import { Controller } from '@nestjs/common';
import { UsersProjectRoleService } from './users-project-role.service';

@Controller('users-project-role')
export class UsersProjectRoleController {
  constructor(private readonly usersProjectRoleService: UsersProjectRoleService) {}
}
