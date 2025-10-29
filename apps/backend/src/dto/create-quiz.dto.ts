import { IsString, IsEnum, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QuestionDto {
  @ApiProperty({ example: 'What is 2+2?' })
  @IsString()
  text: string;

  @ApiProperty({ example: 'checkbox', enum: ['boolean', 'input', 'checkbox'] })
  @IsEnum(['boolean', 'input', 'checkbox'])
  type: 'boolean' | 'input' | 'checkbox';

  @ApiPropertyOptional({ example: ['Option 1', 'Option 2'], type: [String] })
  @IsArray()
  @IsOptional()
  options?: string[];

  @ApiPropertyOptional({ example: 'Option 1' })
  @IsOptional()
  @IsString()
  answer?: string;
}

export class CreateQuizDto {
  @ApiProperty({ example: 'Math Quiz' })
  @IsString()
  title: string;

  @ApiProperty({ type: [QuestionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}
