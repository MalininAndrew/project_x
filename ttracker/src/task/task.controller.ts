import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TasksService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';

@Controller('task')
export class TaskController {
  constructor(private readonly tasksService: TasksService) {}

    @Post()
    create(@Body() dto: CreateTaskDto) {
      return this.tasksService.create(dto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
      return this.tasksService.update(+id, dto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.tasksService.findOne(+id);
    }

    @Get('user/:userId')
    findByUser(@Param('userId') userId: string) {
      return this.tasksService.findByUser(+userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('project/:projectId')
    findByProject(@Param('projectId') projectId: string) {
      return this.tasksService.findByProject(+projectId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
      return this.tasksService.delete(+id);
    }
}
