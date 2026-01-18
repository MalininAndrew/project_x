import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UsersService } from 'src/users/users.service';
import { FindProjectsByUserDto } from './dto/find-project.dto';
import { UsersProjectRoleService } from 'src/users-project-role/users-project-role.service';
import { CreateUsersProjectRoleDto } from 'src/users-project-role/dto/create-users-project-role.dto';
import { DeleteUserFromProjectDto } from 'src/users-project-role/dto/delete-users-from-project.dto';


@Controller('projects')
export class ProjectsController {
	constructor(
		private readonly projectsService: ProjectsService,
		private readonly usersProjectRoleService: UsersProjectRoleService
	) {}

	@Post('create')
	async createProject(@Body()dto: CreateProjectDto) {
		return this.projectsService.create(dto);
	}

	@Patch('update')
	async updateProject(@Body()dto: UpdateProjectDto) {
		return this.projectsService.update(dto)
	}

	@Get('findProjectsByUserId/:projectId')
	async findProjectsByUserId(@Param('projectId') projectId: number) {
		return this.projectsService.findProjectsByUserId(projectId);
	}

	@Get('ProjectUsers/:userId')
	async getProjectUsersByProjectId(@Param('userId') userId: number) {
		return this.projectsService.getProjectUsersByProjectId(userId);
	}

	@Delete('delete/:id')
	async deleteProject(@Param('id') id: number) {
		return this.projectsService.delete(id)
	}

	@Post('addMember')
	async addMemberToProject(@Body()dto: CreateUsersProjectRoleDto) {
		return this.usersProjectRoleService.create(dto);
	}

	@Delete('removeUser')
	async removeUserFromProject(@Body()dto: DeleteUserFromProjectDto) {
		return this.usersProjectRoleService.deleteUserFromProject(dto);
	}


}
