import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('statuses')
export class StatusesController {
    constructor(private readonly statusService: StatusesService) {}

    @Post('create')
    async create(@Body() dto: CreateStatusDto) {
        return this.statusService.create(dto);
    }
    
    @Patch('update/:id')
    async update(@Param('id') id: number, @Body() dto: UpdateStatusDto) {
      return this.statusService.update(id, dto);
    }
    
    @Delete(':id')
    async delete(@Param('id') id: number) {
      return this.statusService.delete(id);
    }
    
    @Get(':id')
    async getAllStatusesByProjectId(@Param('id') id: number) {
      return  this.statusService.getAllStatusesByProjectId(id);
    }
}
