import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { NOT_FOUND_TASK_ERROR } from './task.constants';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        taskName: dto.taskName,
        creatorId: dto.creatorId,
        executorId: dto.executorId ?? null,
        projectId: dto.projectId,
        description: dto.description ?? null,
        statusId: dto.statusId,
        priorityId: dto.priorityId,
        parentTaskId: dto.parentTaskId ?? null,
        isSubtask: dto.isSubtask,
        deadline: dto.deadline,
        isDone: false
      },
    });
  }

  async update(id: number, dto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException(NOT_FOUND_TASK_ERROR);

    return this.prisma.task.update({
      where: { id },
      data: {
        ...dto
      },
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        creator: {
			select: {
				id: true,
				name: true,
				email: true,
			}
      	},
        executor: {
			select: {
				id: true,
				name: true,
				email: true,
			}
      	},
        status: true,
        priority: true,
		parentTask: true
      },
    });

    if (!task) throw new NotFoundException(NOT_FOUND_TASK_ERROR);
    return task;
  }

  async findByUser(userId: number) {
    return this.prisma.task.findMany({
      where: {
        executorId: userId,
      },
    });
  }

  async findByProject(projectId: number) {
    return this.prisma.task.findMany({
      where: { projectId },
    });
  }

  async delete(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException(NOT_FOUND_TASK_ERROR);

    const subtasks = await this.prisma.task.findMany({ where: {parentTaskId: id}})

    if (subtasks.length > 0) {
      await this.prisma.task.deleteMany({ where: { parentTaskId: id}})
    }

    //Дописать удаление комментов по задаче

    return this.prisma.task.delete({ where: { id } });
  }

  async deleteAllByProjectId(projectId: number) {
    return this.prisma.task.deleteMany({
      where: {
				projectId
			}
    })
  }
}