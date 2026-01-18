import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  
  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.commentsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.commentsService.update(+id, dto);
  }

  @Get('task/:taskId')
  findByTask(@Param('taskId') taskId: string) {
    return this.commentsService.findByTask(+taskId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.commentsService.delete(+id);
  }
}
