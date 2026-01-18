import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class StatusesService {
	constructor(private readonly prisma: PrismaService) {}

	async create({ projectId, name, sortIndex }: CreateStatusDto) {
		return this.prisma.status.create({
			data: {
				name,
				projectId,
				sortIndex
			}
		});
	}

	async update(id: number, { name, sortIndex }: UpdateStatusDto) {
		return this.prisma.status.update({
			where: {
				id
			},
			data: {
				name,
				sortIndex
			}
		});
	}

	async delete(id: number) {
		return this.prisma.status.delete({
			where: {
				id
			}
		});
	}

	async deleteAllByProjectId(projectId: number) {
		return this.prisma.status.deleteMany({
			where: {
				projectId
			}
		})
	}

	async getAllStatusesByProjectId(projectId: number) {
		return this.prisma.status.findMany({
			where: {
				projectId: projectId
			}
		});
	}
}
