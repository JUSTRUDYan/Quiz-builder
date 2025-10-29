
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('index')
@Controller('index')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new quiz' })
  @ApiResponse({ status: 201, description: 'Quiz created successfully' })
  create(@Body() dto: CreateQuizDto) {
    return this.appService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all index' })
  @ApiResponse({ status: 200, description: 'List of index' })
  findAll() {
    return this.appService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quiz by ID' })
  @ApiResponse({ status: 200, description: 'Quiz details' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  findOne(@Param('id') id: number) {
    return this.appService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a quiz' })
  @ApiResponse({ status: 200, description: 'Quiz deleted successfully' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  remove(@Param('id') id: number) {
    return this.appService.remove(id);
  }
}
