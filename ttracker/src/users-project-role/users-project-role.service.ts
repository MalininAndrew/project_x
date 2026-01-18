import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUsersProjectRoleDto } from './dto/create-users-project-role.dto';
import { UpdateUsersProjectRoleDto } from './dto/update-users-project-role.dto';
import { USER_ALREADY_ADDED_TO_PROJECT } from './users-project-role.constants';
import { DeleteUserFromProjectDto } from './dto/delete-users-from-project.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UsersProjectRoleService {
	constructor(
			private readonly prisma: PrismaService,
			private readonly userService: UsersService
		) {}
	
		async create({ userId, projectId, roleId }: CreateUsersProjectRoleDto) {
			const user = await this.prisma.projectUserRole.findUnique({
				where: {
					userId_projectId: {
						userId,
						projectId
					}
				}
			});

			if (user) {
				throw new NotFoundException(USER_ALREADY_ADDED_TO_PROJECT);
			}

			const usersProjectRole = await this.prisma.projectUserRole.create({
				data: {
					userId,
					projectId,
					roleId
				}
			})

			return this.userService.findUserById(usersProjectRole.userId);
		
		}
	
		async update({ id, roleId }: UpdateUsersProjectRoleDto) {
			return this.prisma.projectUserRole.update({
				where: {
					id
				},
				data: {
					roleId
				}
			})
		}
	
		async deleteUserFromProject({ userId, projectId }: DeleteUserFromProjectDto) {
			return this.prisma.projectUserRole.delete({
				where: {
					userId_projectId: {
						userId,
						projectId
					}
				}
			})
		}

		async deleteAllByProjectId(projectId: number) {
			return this.prisma.projectUserRole.deleteMany({
				where: {
					projectId
				}
			})
		}
}
