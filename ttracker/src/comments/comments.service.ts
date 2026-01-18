import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { COMMENT_NOT_FOUND_ERROR } from './comments.constants';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create({ description, taskId, userId }: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        description,
        taskId,
        userId
      },
    });
  }

  async update(id: number, dto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException(COMMENT_NOT_FOUND_ERROR);
    }

    return this.prisma.comment.update({
      where: { id },
      data: {
        description: dto.description,
      },
    });
  }

  async findByTask(taskId: number) {
    return this.prisma.comment.findMany({
      where: { taskId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createDate: 'asc' },
    });
  }

  async delete(id: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException(COMMENT_NOT_FOUND_ERROR);
    }

    return this.prisma.comment.delete({ where: { id } });
  }
}
