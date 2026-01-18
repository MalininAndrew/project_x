import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FindProjectsByUserDto } from './dto/find-project.dto';
import { StatusesService } from 'src/statuses/statuses.service';
import { UsersProjectRoleService } from 'src/users-project-role/users-project-role.service';
import { ProjectReturned } from 'src/auth/interfaces/project.interface';
import { TasksService } from 'src/task/task.service';

@Injectable()
export class ProjectsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly statusService: StatusesService,
		private readonly usersProjectRoleService: UsersProjectRoleService,
		private readonly taskService: TasksService
	) {}

	async create({ name, description, ownerId, companyId }: CreateProjectDto): Promise<ProjectReturned> {
		const project = await this.prisma.project.create({
			data: {
				name,
				description,
				ownerId,
				companyId
			}
		})

		const status1 = await this.statusService.create({ projectId: project.id, name: 'Новые', sortIndex: 1 });
		const status2 = await this.statusService.create({ projectId: project.id, name: 'В работе', sortIndex: 2 });
		const status3 = await this.statusService.create({ projectId: project.id, name: 'Завершено', sortIndex: 3 });

		this.usersProjectRoleService.create({ userId: ownerId, projectId: project.id, roleId: 1 });

		const projectFull = {...project, statuses: [status1, status2, status3 ],}

		return projectFull;
	}

	async update({ id, name, description }: UpdateProjectDto): Promise<ProjectReturned> {
		return this.prisma.project.update({
			where: {
				id
			},
			data: {
				name,
				description
			},
			include: {
				statuses: {
					select: {
						id: true,
						name: true,
						projectId: true,
					},
				},
			},
		})
	}

	async findProjectsByUserId(userId: number) {
		return this.prisma.project.findMany({
			where: {
				projectRoles: {
					some: { userId } 	
				}
			},
			select: {
				id: true,
				name: true,
				description: true,
				ownerId: true,
				companyId: true,
				createDate: true,
				statuses: true, 
			},
		})
	}

	async getProjectUsersByProjectId(projectId: number) {
		return this.prisma.user.findMany({
			where: {
				projectRoles: {
					some: { projectId }, // связь через таблицу ProjectUserRole
				},
			},
			select: {
				id: true,
				name: true,
				email: true,
				createDate: true,
				updateDate: true,
				roleId: true,
				companyId: true,
			},
		});
	}

	async delete(id: number) {
		await this.usersProjectRoleService.deleteAllByProjectId(id);
		await this.taskService.deleteAllByProjectId(id);
		await this.statusService.deleteAllByProjectId(id);
		return this.prisma.project.delete({
			where: {
				id
			}
		})
	}
}
